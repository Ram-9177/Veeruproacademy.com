import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey } from '@prisma/client'

const updateModuleSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().optional()
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const moduleData = await prisma.module.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: { id: true, title: true, slug: true }
        },
        lessons: {
          select: { 
            id: true, 
            title: true, 
            slug: true, 
            order: true, 
            status: true,
            estimatedMinutes: true,
            difficulty: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { lessons: true }
        }
      }
    })

    if (!moduleData) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    return NextResponse.json({ module: moduleData })
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateModuleSchema.parse(body)

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id: params.id }
    })

    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Check if slug is unique within the course (if slug is being updated)
    if (data.slug && data.slug !== existingModule.slug) {
      const slugExists = await prisma.module.findFirst({
        where: {
          courseId: existingModule.courseId,
          slug: data.slug,
          id: { not: params.id }
        }
      })

      if (slugExists) {
        return NextResponse.json({ error: 'Module slug already exists in this course' }, { status: 400 })
      }
    }

    const moduleData = await prisma.module.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        order: data.order
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true }
        },
        lessons: {
          select: { 
            id: true, 
            title: true, 
            slug: true, 
            order: true, 
            status: true,
            estimatedMinutes: true,
            difficulty: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { lessons: true }
        }
      }
    })

    return NextResponse.json({ module: moduleData })
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if module has lessons
    const lessonCount = await prisma.lesson.count({
      where: { moduleId: params.id }
    })

    if (lessonCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete module with lessons. Please delete all lessons first.' 
      }, { status: 400 })
    }

    await prisma.module.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}