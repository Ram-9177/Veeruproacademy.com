import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { adminRateLimiter, sanitize } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimitResult = adminRateLimiter.check(clientIp)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many admin requests. Please slow down.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    const session = await auth()
    
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Sanitize and validate query parameters
    const timeRange = sanitize.string(searchParams.get('timeRange') || '30d')
    const validTimeRanges = ['7d', '30d', '90d', '365d']
    
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time range. Must be one of: 7d, 30d, 90d, 365d' },
        { status: 400 }
      )
    }

    // Calculate date range
    const daysBack = parseInt(timeRange.replace('d', ''))
    const startDate = new Date(Date.now() - (daysBack * 24 * 60 * 60 * 1000))

    // Get comprehensive admin analytics
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalProjects,
      activeUsers,
      recentEnrollments,
      courseStats,
      userGrowth
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total courses
      prisma.course.count(),
      
      // Total enrollments
      prisma.enrollment.count(),
      
      // Total projects
      prisma.project.count(),
      
      // Active users (within time range)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate
          }
        }
      }),
      
      // Recent enrollments (sanitized)
      prisma.enrollment.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
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
        take: 10
      }),
      
      // Course enrollment stats
      prisma.course.findMany({
        include: {
          _count: {
            select: {
              enrollments: true
            }
          }
        },
        orderBy: {
          enrollments: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // User growth (last 12 months) - using safe query
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Revenue analytics (if you have payment data) - with time range filter
    const revenue = await prisma.payment.aggregate({
      _sum: {
        amountInPaise: true
      },
      where: {
        status: 'CAPTURED',
        createdAt: {
          gte: startDate
        }
      }
    })

    // Sanitize sensitive data before returning
    const sanitizedRecentActivity = recentEnrollments.map(enrollment => ({
      id: enrollment.id,
      userName: sanitize.string(enrollment.user.name || 'Unknown'),
      userEmail: sanitize.email(enrollment.user.email || ''),
      courseTitle: sanitize.string(enrollment.course.title),
      courseSlug: sanitize.string(enrollment.course.slug),
      enrolledAt: enrollment.startedAt.toISOString(),
      progress: 0 // Progress is tracked in CourseProgress model
    }))

    const sanitizedPopularCourses = courseStats.map(course => ({
      title: sanitize.string(course.title),
      slug: sanitize.string(course.slug),
      enrollments: course._count.enrollments
    }))

    // Process user growth data safely
    const processedUserGrowth = userGrowth.map(item => ({
      month: item.createdAt,
      count: item._count.id
    }))

    return NextResponse.json({
      overview: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalProjects,
        activeUsers,
        monthlyRevenue: revenue._sum.amountInPaise || 0,
        timeRange
      },
      recentActivity: sanitizedRecentActivity,
      popularCourses: sanitizedPopularCourses,
      userGrowth: processedUserGrowth,
      rateLimitRemaining: rateLimitResult.remaining,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}