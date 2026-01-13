import { NextRequest, NextResponse } from 'next/server'
import { ProductType, RoleKey, type Prisma } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { isAdminOrMentor } from '@/lib/auth-utils'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'

/**
 * POST /api/enrollments
 * Create a new enrollment for a user in a course (with database persistence)
 * 
 * Body: { courseId: string }
 * Returns: { success: boolean, enrollment?: Enrollment, error?: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 enrollments per minute per IP
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const isAllowed = rateLimit(`enrollments_${clientIp}`, {
      max: 10,
      windowMs: 60 * 1000  // 1 minute
    })
    
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Too many enrollment requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId } = body

    // Validation
    if (!courseId || typeof courseId !== 'string' || courseId.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid courseId' },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, slug: true, price: true }
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
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
          {
            success: false,
            error: 'Payment required to enroll in this course',
            redirect: `/courses/${course.slug}/payment`,
          },
          { status: 403 },
        )
      }
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        {
          success: true,
          message: 'Already enrolled in this course',
          enrollment: existingEnrollment,
          course: course
        },
        { status: 200 }
      )
    }

    // Create enrollment within transaction
    // PrismaClient doesn't have $transaction on the client directly, we need to handle it differently
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: 'ACTIVE',
        startedAt: new Date()
      },
      include: {
        course: {
          select: { title: true, slug: true }
        }
      }
    })

    // Initialize course progress
    await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      update: {},
      create: {
        userId: session.user.id,
        courseId,
        completedLessons: 0,
        totalLessons: 0,
        progressPercent: 0
      }
    })

    logger.info(`User ${session.user.id} enrolled in course ${courseId}`)

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        courseName: enrollment.course.title,
        courseSlug: enrollment.course.slug,
        status: enrollment.status,
        startedAt: enrollment.startedAt.toISOString()
      }
    })
  } catch (error) {
    logger.error('Enrollment creation failed', error)
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'production' 
          ? 'Enrollment failed. Please try again.' 
          : error instanceof Error ? error.message : 'Enrollment failed'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/enrollments?courseId=xxx
 * Check if user is enrolled in a course
 * 
 * Query: { courseId: string }
 * Returns: { success: boolean, enrolled: boolean, enrollment?: Enrollment }
 */
export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'courseId is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: true, enrolled: false }
      )
    }

    // Check database for enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId
        }
      },
      include: {
        course: {
          select: { title: true, slug: true }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json({
        success: true,
        enrolled: false
      })
    }

    return NextResponse.json({
      success: true,
      enrolled: true,
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        courseName: enrollment.course.title,
        courseSlug: enrollment.course.slug,
        status: enrollment.status,
        startedAt: enrollment.startedAt.toISOString()
      }
    })
  } catch (error) {
    logger.error('Check enrollment failed', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check enrollment status' },
      { status: 500 }
    )
  }
}
