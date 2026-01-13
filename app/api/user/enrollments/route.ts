import { NextResponse } from 'next/server'
import { ProductType, RoleKey, type Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminOrMentor } from '@/lib/auth-utils'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user enrollments with course progress
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        course: {
          select: {
            slug: true,
            title: true,
            description: true,
            thumbnail: true,
            duration: true,
            _count: {
              select: { lessons: true }
            }
          },
        }
      }
    })

    // Transform to match frontend interface
    // Build helper maps: progress and certificates
    const courseIds = enrollments.map(e => e.courseId)
    const courseProgresses = await prisma.courseProgress.findMany({
      where: { userId: session.user.id, courseId: { in: courseIds } },
      select: { courseId: true, progressPercent: true, updatedAt: true, completedLessons: true, totalLessons: true }
    })
    const progressMap = new Map(courseProgresses.map(cp => [cp.courseId, cp]))

    const certificates = await prisma.certificate.findMany({
      where: { userId: session.user.id, courseId: { in: courseIds } },
      select: { courseId: true }
    })
    const certificateSet = new Set(certificates.map(c => c.courseId))

    const enrolledCourses = enrollments.map(enrollment => {
      const { _count, ...courseData } = enrollment.course
      const prog = progressMap.get(enrollment.courseId)
      return {
        courseSlug: courseData.slug,
        enrolledAt: enrollment.startedAt.toISOString(),
        progressPercent: prog ? prog.progressPercent : 0,
        completedLessons: prog ? prog.completedLessons : 0,
        totalLessons: prog ? prog.totalLessons : _count.lessons,
        lastAccessed: prog ? prog.updatedAt.toISOString() : enrollment.startedAt.toISOString(),
        completed: Boolean(enrollment.completedAt),
        certificateEarned: certificateSet.has(enrollment.courseId),
        course: {
          ...courseData,
          lessons: _count.lessons
        }
      }
    })

    return NextResponse.json(enrolledCourses)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, slug: true, price: true }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    const isPrivileged = isAdminOrMentor(roles)
    const isPaid = typeof course.price === 'number' && course.price > 0

    if (isPaid && !isPrivileged) {
      const savedItem = await prisma.savedItem.findUnique({
        where: {
          userId_itemType_itemId: {
            userId: session.user.id,
            itemType: ProductType.COURSE,
            itemId: course.id,
          },
        },
      })
      const metadata = parseUnlockMetadata(savedItem?.metadata as Prisma.JsonValue | null)
      if (!metadata || metadata.status !== 'approved') {
        return NextResponse.json(
          { error: 'Payment required to enroll in this course', redirect: `/courses/${course.slug}/payment` },
          { status: 403 },
        )
      }
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      }
    })

    if (existing) {
      return NextResponse.json({ message: 'Already enrolled' }, { status: 200 })
    }

    // Create enrollment and init progress in transaction
    await prisma.$transaction([
      prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId,
          status: 'ACTIVE'
        }
      }),
      prisma.courseProgress.create({
        data: {
          userId: session.user.id,
          courseId,
          completedLessons: 0,
          totalLessons: 0, // Should ideally fetch from course
          progressPercent: 0
        }
      })
    ])

    return NextResponse.json({ success: true, message: 'Enrolled successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
