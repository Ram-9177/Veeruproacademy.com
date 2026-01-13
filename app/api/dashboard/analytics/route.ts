import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get real-time analytics for the user
    const [
      enrollmentCount,
      completedCourses,
      totalProjects,
      certificates,
      recentActivity
    ] = await Promise.all([
      // Total enrollments
      prisma.enrollment.count({
        where: { userId: session.user.id }
      }),
      
      // Completed courses
      prisma.enrollment.count({
        where: { 
          userId: session.user.id,
          completedAt: { not: null }
        }
      }),
      
      // Total projects (using assignment submissions as proxy)
      prisma.assignmentSubmission.count({
        where: { userId: session.user.id }
      }),
      
      // Certificates earned
      prisma.certificate.count({
        where: { 
          userId: session.user.id
        }
      }),
      
      // Recent activity
      prisma.enrollment.findMany({
        where: { userId: session.user.id },
        include: {
          course: {
            select: {
              title: true,
              slug: true
            }
          }
        },
        orderBy: {
          startedAt: 'desc'
        },
        take: 5
      })
    ])

    // Calculate average progress and build a map by courseId for recent activity
    const courseProgresses = await prisma.courseProgress.findMany({
      where: { userId: session.user.id },
      select: { courseId: true, progressPercent: true, updatedAt: true }
    })

    const avgProgress = courseProgresses.length > 0
      ? Math.round(courseProgresses.reduce((sum, cp) => sum + (cp.progressPercent || 0), 0) / courseProgresses.length)
      : 0

    const progressMap = new Map(courseProgresses.map(cp => [cp.courseId, cp]))

    return NextResponse.json({
      stats: {
        enrollments: enrollmentCount,
        completedCourses,
        totalProjects,
        certificates,
        avgProgress
      },
      recentActivity: recentActivity.map(activity => {
        const prog = progressMap.get(activity.courseId)
        return {
          courseTitle: activity.course.title,
          courseSlug: activity.course.slug,
          progress: prog ? prog.progressPercent : 0,
          lastAccessed: prog ? prog.updatedAt.toISOString() : activity.startedAt.toISOString()
        }
      })
    })
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}