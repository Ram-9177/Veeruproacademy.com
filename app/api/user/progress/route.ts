import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserCourseProgress, getUserCertificates } from '@/lib/course-tracking'
import { apiRateLimiter, sanitize } from '@/lib/security'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimitResult = apiRateLimiter.check(clientIp)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000))
          }
        }
      )
    }

    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    // Validate and sanitize courseId if provided
    const sanitizedCourseId = courseId ? sanitize.string(courseId) : undefined
    
    if (courseId && !sanitizedCourseId) {
      return NextResponse.json(
        { error: 'Invalid course ID format' },
        { status: 400 }
      )
    }

    // Get course progress - only for the authenticated user
    const progressResult = await getUserCourseProgress(session.user.id, sanitizedCourseId)
    
    if (!progressResult.success) {
      return NextResponse.json(
        { error: progressResult.message || 'Failed to get progress' },
        { status: 500 }
      )
    }

    // Get certificates - only for the authenticated user
    const certificatesResult = await getUserCertificates(session.user.id)
    
    if (!certificatesResult.success) {
      return NextResponse.json(
        { error: certificatesResult.message || 'Failed to get certificates' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      progress: progressResult.progress,
      certificates: certificatesResult.certificates,
      rateLimitRemaining: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('User progress error:', error)
    return NextResponse.json(
      { error: 'Failed to get user progress' },
      { status: 500 }
    )
  }
}