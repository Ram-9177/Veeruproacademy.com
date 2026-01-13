import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ContentStatus } from '@prisma/client'
import { mapDbCourse } from './course-mapper'

// Mark this route as dynamic to avoid static generation bailouts when accessing request.url
export const dynamic = 'force-dynamic' as const;

// GET /api/courses - Fetch all published courses from database
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      level: searchParams.get('level') || undefined,
      search: searchParams.get('search') || undefined,
    }

    const dbCourses = await prisma.course.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(filters.level && filters.level !== 'All' ? { level: filters.level } : {}),
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
        instructor: true,
      },
    })

    const mapped = dbCourses.map(mapDbCourse)
    return NextResponse.json({ 
      success: true, 
      data: mapped, 
      count: mapped.length, 
      total: mapped.length,
      source: 'database' 
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch courses from database',
      data: [],
      count: 0,
      total: 0
    }, { status: 500 })
  }
}
