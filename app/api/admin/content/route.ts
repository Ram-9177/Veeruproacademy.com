import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminOrMentor } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

// GET /api/admin/content - Get all content or search
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !isAdminOrMentor(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'lesson', 'project', 'page', 'all'
    const search = searchParams.get('search') || ''

    let cmsPages: any[] = []
    let lessons: any[] = []
    let projects: any[] = []

    // Fetch CMS Pages
    if (!type || type === 'all' || type === 'page') {
      cmsPages = await prisma.cmsPage.findMany({
        where: search ? { 
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : undefined,
        orderBy: { updatedAt: 'desc' },
        include: { author: true }
      })
    }

    // Fetch Lessons
    if (!type || type === 'all' || type === 'lesson') {
      lessons = await prisma.lesson.findMany({
        where: search ? { 
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : undefined,
        orderBy: { updatedAt: 'desc' },
        include: { course: true }
      })
    }

    // Fetch Projects
    if (!type || type === 'all' || type === 'project') {
      projects = await prisma.project.findMany({
        where: search ? { 
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : undefined,
        orderBy: { updatedAt: 'desc' }
      })
    }

    // Normalize and Combine
    const normalizedContent = [
      ...cmsPages.map(p => ({
        id: p.id,
        title: p.title,
        type: 'page',
        status: p.isPublished ? 'published' : 'draft', // or p.status.toLowerCase()
        author: p.author?.name || 'Admin',
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        views: 0, // Placeholder
      })),
      ...lessons.map(l => ({
        id: l.id,
        title: l.title,
        type: 'lesson',
        status: l.status.toLowerCase(),
        author: 'System', // Lessons don't have explicit author field in schema usually, simplified
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
        courseSlug: l.course?.slug,
      })),
      ...projects.map(p => ({
        id: p.id,
        title: p.title,
        type: 'project',
        status: p.status.toLowerCase(),
        author: 'System',
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))
    ]

    // Sort combined list by updatedAt desc
    normalizedContent.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return NextResponse.json({
      success: true,
      data: normalizedContent,
      total: normalizedContent.length
    })

  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST /api/admin/content - Create new content (CMS Page only for now via this generic endpoint)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !isAdminOrMentor(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, content, slug } = body

    if (type === 'page') {
      // Create CMS Page
      const newPage = await prisma.cmsPage.create({
        data: {
          title,
          slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          status: 'DRAFT',
          isPublished: false,
          authorId: session.user.id,
          // content/blocks would need to be handled. Schema has `blocks`.
          // For now assuming content is not saved here or simpler. 
          // Actually schema has `blocks: Json`.
          blocks: content ? { content } : undefined 
        }
      })
       return NextResponse.json({ success: true, data: newPage })
    }

    // Implement other types if needed, or return error
    return NextResponse.json({ success: false, error: 'Only page creation supported via this endpoint currently.' }, { status: 400 })

  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    )
  }
}
