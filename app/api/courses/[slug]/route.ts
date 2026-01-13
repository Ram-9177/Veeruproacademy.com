import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { mapDbCourse } from '../course-mapper'

// GET /api/courses/[slug] - Fetch single course by slug from database
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const dbCourse = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
        instructor: true,
      },
    })

    if (!dbCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mapDbCourse(dbCourse),
      source: 'database',
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course from database' },
      { status: 500 }
    )
  }
}
