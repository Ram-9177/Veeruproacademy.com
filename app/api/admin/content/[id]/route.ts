import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminOrMentor } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

// GET /api/admin/content/[id] - Get specific content item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || !isAdminOrMentor(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Try CmsPage
    const page = await prisma.cmsPage.findUnique({
      where: { id: params.id },
      include: { author: true }
    })

    if (page) {
      return NextResponse.json({
        success: true,
        data: {
          ...page,
          type: 'page',
          content: page.blocks ? (page.blocks as any).content || '' : '', 
          status: page.isPublished ? 'published' : 'draft'
        }
      })
    }

    // 2. Try Lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id }
    })

    if (lesson) {
      return NextResponse.json({
        success: true,
        data: {
          id: lesson.id,
          title: lesson.title,
          slug: lesson.slug,
          type: 'lesson',
          status: lesson.status.toLowerCase(),
          content: lesson.body || lesson.description || '',
          description: lesson.description
        }
      })
    }

    // 3. Try Project
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (project) {
      return NextResponse.json({
        success: true,
        data: {
          id: project.id,
          title: project.title,
          slug: project.slug,
          type: 'project',
          status: project.status.toLowerCase(),
          content: project.description || '', // Projects often store main detailed info in description or have external assets
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Content not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/content/[id] - Update content item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || !isAdminOrMentor(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, content, status } = body

    // We need to know the type to update correctly. 
    // Ideally the client sends it, but if not we can infer by checking existence again.
    // For efficiency, let's try updating.

    // 1. Try CmsPage
    const pageExists = await prisma.cmsPage.count({ where: { id: params.id } })
    if (pageExists) {
        const updatedPage = await prisma.cmsPage.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                isPublished: status === 'published',
                status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
                blocks: content ? { content } : undefined // Store content in blocks JSON
            }
        })
        return NextResponse.json({ success: true, data: updatedPage, message: 'Page updated successfully' })
    }

    // 2. Try Lesson
    const lessonExists = await prisma.lesson.count({ where: { id: params.id } })
    if (lessonExists) {
        const updatedLesson = await prisma.lesson.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
                body: content, // Map content to body
                description: body.description // Optional if passed
            }
        })
        return NextResponse.json({ success: true, data: updatedLesson, message: 'Lesson updated successfully' })
    }

    // 3. Try Project
    const projectExists = await prisma.project.count({ where: { id: params.id } })
    if (projectExists) {
        const updatedProject = await prisma.project.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
                description: content // Map content to description for now
            }
        })
        return NextResponse.json({ success: true, data: updatedProject, message: 'Project updated successfully' })
    }

    return NextResponse.json(
      { success: false, error: 'Content not found' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/content/[id] - Delete content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || !isAdminOrMentor(session.user.roles || [])) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Try CmsPage
    try {
        await prisma.cmsPage.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true, message: 'Page deleted successfully' })
    } catch {
        // Not found or error, continue
    }

    // 2. Try Lesson
    try {
        await prisma.lesson.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true, message: 'Lesson deleted successfully' })
    } catch {
        // Not found or error, continue
    }

    // 3. Try Project
    try {
        await prisma.project.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true, message: 'Project deleted successfully' })
    } catch {
        // Not found or error, continue
    }

    return NextResponse.json({
      success: false,
      error: 'Content not found or could not be deleted'
    }, { status: 404 })

  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    )
  }
}
