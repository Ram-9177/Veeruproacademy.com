import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { adminRateLimiter } from '@/lib/security'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/audit - Get audit logs (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    const rateLimitResult = adminRateLimiter.check(clientIp)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many admin requests. Please slow down.' },
        { status: 429 }
      )
    }

    // SECURITY: Authentication and authorization
    const session = await auth()
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Max 100 per page
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (userId) {
      where.userId = userId
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Fetch audit logs with pagination
    const [logs, totalCount] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.activityLog.count({ where })
    ])

    // Get audit statistics
    const stats = await prisma.activityLog.groupBy({
      by: ['type'],
      _count: {
        type: true
      },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    })

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log.id,
        type: log.type,
        message: log.message,
        userId: log.userId,
        userName: log.user?.name || 'Unknown',
        userEmail: log.user?.email || 'Unknown',
        data: log.data,
        createdAt: log.createdAt.toISOString()
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      stats: stats.map(stat => ({
        type: stat.type,
        count: stat._count.type
      }))
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/audit - Create audit log entry (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
    const rateLimitResult = adminRateLimiter.check(clientIp)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many admin requests. Please slow down.' },
        { status: 429 }
      )
    }

    // SECURITY: Authentication and authorization
    const session = await auth()
    if (!session?.user || !isAdmin(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, message, data, targetUserId } = body

    // SECURITY: Input validation
    if (!type || !message) {
      return NextResponse.json(
        { error: 'Type and message are required' },
        { status: 400 }
      )
    }

    const validTypes = [
      'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
      'COURSE_CREATED', 'COURSE_UPDATED', 'COURSE_DELETED',
      'ADMIN_ACTION', 'SECURITY_EVENT', 'SYSTEM_EVENT'
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid audit log type' },
        { status: 400 }
      )
    }

    // Create audit log entry
    const auditLog = await prisma.activityLog.create({
      data: {
        userId: targetUserId || session.user.id,
        type,
        message: message.slice(0, 500), // Limit message length
        data: {
          ...data,
          adminUserId: session.user.id,
          adminUserEmail: session.user.email,
          ip: clientIp,
          userAgent: request.headers.get('user-agent') || 'Unknown'
        }
      }
    })

    return NextResponse.json({
      success: true,
      auditLog: {
        id: auditLog.id,
        type: auditLog.type,
        message: auditLog.message,
        createdAt: auditLog.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Error creating audit log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}