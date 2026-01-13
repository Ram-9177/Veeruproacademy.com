import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { adminRateLimiter, sanitize, validatePassword, hashPassword } from '@/lib/security'

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
    const search = sanitize.string(searchParams.get('search') || '')
    const role = sanitize.string(searchParams.get('role') || 'all')
    const status = sanitize.string(searchParams.get('status') || 'all')
    const page = sanitize.number(searchParams.get('page'), 1, 1000) || 1
    const limit = sanitize.number(searchParams.get('limit'), 1, 100) || 20

    // Build where clause with input validation
    const where: any = {}
    
    if (search && search.length >= 2) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const validRoles = ['ADMIN', 'MENTOR', 'STUDENT']
    if (role !== 'all' && validRoles.includes(role.toUpperCase())) {
      where.roles = {
        some: {
          role: {
            key: role.toUpperCase()
          }
        }
      }
    }

    const validStatuses = ['active', 'pending', 'inactive']
    if (status !== 'all' && validStatuses.includes(status)) {
      if (status === 'active') {
        where.emailVerifiedAt = { not: null }
        where.status = 'ACTIVE'
      } else if (status === 'pending') {
        where.emailVerifiedAt = null
      } else if (status === 'inactive') {
        where.status = { in: ['INACTIVE', 'SUSPENDED'] }
      }
    }

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          roles: {
            include: {
              role: true
            }
          },
          enrollments: {
            select: {
              id: true,
              completedAt: true
            }
          },
          assignmentSubmissions: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    // Transform data for frontend with sanitization
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: sanitize.string(user.name || 'Unknown'),
      email: sanitize.email(user.email || ''),
      role: user.roles[0]?.role.key.toLowerCase() || 'student',
      status: user.emailVerifiedAt && user.status === 'ACTIVE' ? 'active' : 'pending',
      joinDate: user.createdAt.toISOString(),
      lastLogin: user.lastLoginAt?.toISOString() || user.createdAt.toISOString(),
      coursesEnrolled: user.enrollments.length,
      projectsCompleted: user.assignmentSubmissions.filter(p => p.status === 'REVIEWED').length,
      avatar: user.avatarUrl ? sanitize.string(user.avatarUrl) : null
    }))

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      rateLimitRemaining: rateLimitResult.remaining
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    if (error?.code === 'P1001') {
      return NextResponse.json({ users: [], pagination: { page: 1, limit: 0, total: 0, pages: 0 }, warning: 'Database unreachable; showing empty list.' }, { status: 200 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, email, role, password } = body

    // Enhanced input validation with sanitization
    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = sanitize.string(name)
    const sanitizedEmail = sanitize.email(email)
    const sanitizedRole = sanitize.string(role).toUpperCase()

    if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json({ error: 'Name must be between 2 and 100 characters' }, { status: 400 })
    }

    if (!sanitizedEmail) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['ADMIN', 'MENTOR', 'STUDENT']
    if (!validRoles.includes(sanitizedRole)) {
      return NextResponse.json({ error: 'Invalid role. Must be ADMIN, MENTOR, or STUDENT' }, { status: 400 })
    }

    // Enhanced password validation
    if (password) {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        return NextResponse.json({ 
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors,
          strength: passwordValidation.strength
        }, { status: 400 })
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new user with enhanced security
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash: password ? await hashPassword(password) : null,
        emailVerifiedAt: new Date(),
        status: 'ACTIVE'
      }
    })

    // Assign role
    const roleRecord = await prisma.role.findUnique({
      where: { key: sanitizedRole as any }
    })

    if (roleRecord) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roleRecord.id,
          isPrimary: true
        }
      })
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        name: sanitizedName,
        email: sanitizedEmail,
        role: sanitizedRole
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
