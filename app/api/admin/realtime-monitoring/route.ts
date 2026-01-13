import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { RoleKey } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin role
    const user = session.user
    const userRoles = user?.roles || []
    const hasAdminRole = userRoles.includes('ADMIN' as RoleKey) || user?.defaultRole === 'ADMIN'

    if (!hasAdminRole) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalCourses,
      totalProjects,
      recentActivities
    ] = await Promise.all([
      // Total users count
      prisma.user.count(),
      
      // Total published courses
      prisma.course.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Total published projects
      prisma.project.count({
        where: { status: 'PUBLISHED' }
      }),
      
      // Recent realtime activities (last 20)
      prisma.realtimeEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ])

    // Calculate active users (users who logged in within last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: oneDayAgo
        }
      }
    })

    // Fetch recent database records to augment realtime events
    const [newUsers, newCourses, newProjects] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, createdAt: true }
      }),
      prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true }
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, createdAt: true }
      })
    ])

    // Convert DB records to Event format
    const dbEvents = [
      ...newUsers.map(u => ({
        id: `user-${u.id}`,
        channel: 'system',
        type: 'user_login', // reusing existing type for icon/color mapping
        entity: 'User',
        payload: { userName: u.email || 'Unknown User' },
        createdAt: u.createdAt
      })),
      ...newCourses.map(c => ({
        id: `course-${c.id}`,
        channel: 'admin',
        type: 'course_enrollment', // reusing type for icon
        entity: 'Course',
        payload: { userName: 'Admin', courseName: c.title }, // 'Admin created...'
        createdAt: c.createdAt
      })),
      ...newProjects.map(p => ({
        id: `project-${p.id}`,
        channel: 'admin',
        type: 'project_started', // reusing type for icon
        entity: 'Project',
        payload: { userName: 'Admin', projectTitle: p.title },
        createdAt: p.createdAt
      }))
    ]

    // Format realtime activities
    const formattedActivities = [...recentActivities.map(activity => ({
      id: activity.id.toString(),
      channel: activity.channel,
      type: activity.type,
      entity: activity.entity || 'unknown',
      payload: activity.payload || {},
      createdAt: activity.createdAt
    })), ...dbEvents].sort((a, b) => {
        // Sort descending by date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }).map(event => ({
        ...event,
        createdAt: event.createdAt.toISOString()
    }))

    const dashboardData = {
      totalUsers,
      activeUsers,
      totalCourses,
      totalProjects,
      recentActivities: formattedActivities,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Error fetching realtime monitoring data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}