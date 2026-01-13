import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { markLessonCompleted } from '@/lib/course-tracking'

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { lessonId } = params
    
    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    const result = await markLessonCompleted(session.user.id, lessonId)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lesson marked as completed',
      progress: result.lessonProgress
    })

  } catch (error) {
    console.error('Lesson completion error:', error)
    return NextResponse.json(
      { error: 'Failed to mark lesson as completed' },
      { status: 500 }
    )
  }
}