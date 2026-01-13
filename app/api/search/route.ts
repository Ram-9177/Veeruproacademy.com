import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { apiRateLimiter, sanitize } from '@/lib/security'

export const dynamic = 'force-dynamic'

interface SearchResult {
  type: 'course' | 'project' | 'lesson' | 'user'
  id: string
  title: string
  slug: string
  description?: string
  duration?: string
  level?: string
  language?: string
  thumbnail?: string
  price?: number
  status?: string
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const rateLimitResult = apiRateLimiter.check(clientIp)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests. Please slow down.',
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

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // Optional filter by type
    const limit = sanitize.number(searchParams.get('limit'), 1, 50) || 20

    // Input validation
    if (!query) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Search query is required'
      })
    }

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Query must be at least 2 characters long'
      })
    }

    if (query.length > 100) {
      return NextResponse.json({
        success: false,
        error: 'Query too long. Maximum 100 characters allowed.'
      }, { status: 400 })
    }

    // Sanitize and validate search term
    const sanitizedQuery = sanitize.string(query)
    if (!sanitizedQuery) {
      return NextResponse.json({
        success: false,
        error: 'Invalid search query'
      }, { status: 400 })
    }

    const searchTerm = sanitizedQuery.toLowerCase()
    const results: SearchResult[] = []

    // Validate type parameter
    const validTypes = ['course', 'project', 'lesson', 'user']
    if (type && !validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid type parameter'
      }, { status: 400 })
    }

    // Search in courses
    if (!type || type === 'course') {
      const courses = await prisma.course.findMany({
        where: {
          AND: [
            { status: 'PUBLISHED' },
            {
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { level: { contains: searchTerm, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          duration: true,
          level: true,
          thumbnail: true,
          price: true,
          metadata: true
        },
        take: Math.floor(limit / 2)
      })

      courses.forEach(course => {
        results.push({
          type: 'course',
          id: course.id,
          title: sanitize.string(course.title),
          slug: sanitize.string(course.slug),
          description: course.description ? sanitize.string(course.description) : undefined,
          duration: course.duration ? sanitize.string(course.duration) : undefined,
          level: course.level ? sanitize.string(course.level) : undefined,
          language: (course.metadata as any)?.language ? sanitize.string((course.metadata as any).language) : undefined,
          thumbnail: course.thumbnail ? sanitize.string(course.thumbnail) : undefined,
          price: course.price
        })
      })
    }

    // Search in projects
    if (!type || type === 'project') {
      const projects = await prisma.project.findMany({
        where: {
          AND: [
            { status: 'PUBLISHED' },
            {
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { level: { contains: searchTerm, mode: 'insensitive' } },
                { category: { contains: searchTerm, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          level: true,
          category: true,
          thumbnail: true,
          price: true,
          tools: true,
          metadata: true
        },
        take: Math.floor(limit / 2)
      })

      projects.forEach(project => {
        results.push({
          type: 'project',
          id: project.id,
          title: sanitize.string(project.title),
          slug: sanitize.string(project.slug),
          description: project.description ? sanitize.string(project.description) : undefined,
          level: project.level ? sanitize.string(project.level) : undefined,
          language: project.category ? sanitize.string(project.category) : undefined,
          thumbnail: project.thumbnail ? sanitize.string(project.thumbnail) : undefined,
          price: project.price
        })
      })
    }

    // Search in lessons (if no type filter or specifically requested)
    if (!type || type === 'lesson') {
      const lessons = await prisma.lesson.findMany({
        where: {
          AND: [
            { status: 'PUBLISHED' },
            {
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { body: { contains: searchTerm, mode: 'insensitive' } }
              ]
            }
          ]
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          estimatedMinutes: true,
          difficulty: true,
          course: {
            select: {
              slug: true,
              title: true
            }
          }
        },
        take: Math.floor(limit / 4)
      })

      lessons.forEach(lesson => {
        const fallbackDescription = lesson.course?.title
          ? `Lesson from ${lesson.course.title}`
          : 'Lesson'
        results.push({
          type: 'lesson',
          id: lesson.id,
          title: sanitize.string(lesson.title),
          slug: sanitize.string(lesson.slug),
          description: lesson.description ? sanitize.string(lesson.description) : fallbackDescription,
          duration: lesson.estimatedMinutes ? `${lesson.estimatedMinutes} min` : undefined,
          level: lesson.difficulty ? sanitize.string(lesson.difficulty) : undefined
        })
      })
    }

    // Sort results by relevance (exact matches first, then partial matches)
    const sortedResults = results.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase().includes(searchTerm) ? 1 : 0
      const bExactMatch = b.title.toLowerCase().includes(searchTerm) ? 1 : 0
      
      if (aExactMatch !== bExactMatch) {
        return bExactMatch - aExactMatch
      }
      
      // Secondary sort by type priority (courses first, then projects, then lessons)
      const typePriority = { course: 3, project: 2, lesson: 1, user: 0 }
      return (typePriority[b.type] || 0) - (typePriority[a.type] || 0)
    })

    return NextResponse.json({
      success: true,
      data: sortedResults.slice(0, limit),
      total: sortedResults.length,
      query: sanitizedQuery,
      rateLimitRemaining: rateLimitResult.remaining
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed. Please try again.',
        data: []
      },
      { status: 500 }
    )
  }
}
