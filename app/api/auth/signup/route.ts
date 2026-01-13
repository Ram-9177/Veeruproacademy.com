import { NextRequest, NextResponse } from 'next/server'
import { prisma, hasValidDatabaseUrl } from '@/lib/db'
import { RoleKey } from '@prisma/client'
import { 
  validatePassword, 
  validateEmail, 
  hashPassword,
  sanitize,
  signupRateLimiter,
  auditLog 
} from '@/lib/security'

export const runtime = 'nodejs'

/**
 * USER SIGNUP API
 * 
 * ENHANCED SECURITY FEATURES:
 * ✅ Password encryption: bcrypt with 12 rounds
 * ✅ Enhanced password strength validation: 12+ chars, patterns, common passwords
 * ✅ Email validation and uniqueness check
 * ✅ Input sanitization to prevent XSS
 * ✅ Rate limiting: 3 signups per hour per IP
 * ✅ Automatic STUDENT role assignment
 * ✅ Account activation
 * ✅ Audit logging
 * ✅ Comprehensive error handling
 * 
 * @see lib/security.ts for security utilities
 */

export async function POST(request: NextRequest) {
  try {
    if (!hasValidDatabaseUrl) {
      console.error('[api/auth/signup] DATABASE_URL is missing/invalid; signup unavailable')
      return NextResponse.json(
        { error: 'Signup is temporarily unavailable. Server is not configured.' },
        { status: 503 }
      )
    }

    // Rate limiting (prevent abuse)
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown'
    const rateLimitResult = signupRateLimiter.check(clientIp)
    
    if (!rateLimitResult.allowed) {
      // Log suspicious activity
      await auditLog({
        action: 'SIGNUP_RATE_LIMITED',
        resource: 'auth/signup',
        ip: clientIp,
        details: { 
          rateLimitExceeded: true,
          resetTime: rateLimitResult.resetTime 
        }
      })

      return NextResponse.json(
        { 
          error: 'Too many signup attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    const body = await request.json()
    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Enhanced input sanitization
    const sanitizedName = sanitize.string(name)
    const sanitizedEmail = sanitize.email(email)

    // Validate sanitized inputs
    if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    // Email validation
    if (!sanitizedEmail || !validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Enhanced password strength validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      await auditLog({
        action: 'SIGNUP_WEAK_PASSWORD',
        resource: 'auth/signup',
        ip: clientIp,
        details: { 
          email: sanitizedEmail,
          passwordStrength: passwordValidation.strength,
          errors: passwordValidation.errors
        }
      })

      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors,
          strength: passwordValidation.strength,
          score: passwordValidation.score
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingUser) {
      // Log potential account enumeration attempt
      await auditLog({
        action: 'SIGNUP_EMAIL_EXISTS',
        resource: 'auth/signup',
        ip: clientIp,
        details: { 
          email: sanitizedEmail,
          existingUserId: existingUser.id
        }
      })

      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password with enhanced security (12 rounds)
    const passwordHash = await hashPassword(password)

    // Create user with secure defaults
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash,
        emailVerifiedAt: new Date(), // Auto-verify for now (implement email verification later)
        status: 'ACTIVE',
        defaultRole: RoleKey.STUDENT
      }
    })

    // Ensure student role exists
    const studentRole = await prisma.role.upsert({
      where: { key: RoleKey.STUDENT },
      create: {
        key: RoleKey.STUDENT,
        name: 'Student',
        description: 'Default role with access to enrolled courses, projects, and community features.'
      },
      update: {}
    })
    
 // CRITICAL FIX: Validate studentRole is not null before using it
 if (!studentRole || !studentRole.id) {
   console.error('[api/auth/signup] Failed to create/fetch student role')
   throw new Error('System error: Role initialization failed. Please try again.')
 }

    // Assign student role to user
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: studentRole.id,
        isPrimary: true
      }
    })

    // Log successful signup
    await auditLog({
      userId: user.id,
      action: 'USER_SIGNUP',
      resource: 'auth/signup',
      ip: clientIp,
      userAgent: request.headers.get('user-agent') || undefined,
      details: { 
        email: sanitizedEmail,
        name: sanitizedName,
        passwordStrength: passwordValidation.strength
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully',
        user: {
          id: user.id,
          name: sanitizedName,
          email: sanitizedEmail
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('[api/auth/signup] Error creating user:', error instanceof Error ? error.message : String(error))
    
    
    // Log error for monitoring
    await auditLog({
      action: 'SIGNUP_ERROR',
      resource: 'auth/signup',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      details: { 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
    
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
