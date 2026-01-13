import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { enrollUserInCourse } from '@/lib/course-tracking'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { slug } = params
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Course slug is required' },
        { status: 400 }
      )
    }

    // For now, use slug as courseId - in production you'd look up the course by slug
    const result = await enrollUserInCourse(session.user.id, slug)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment: result.enrollment
    })

  } catch (error) {
    console.error('Course enrollment error:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    )
  }
}