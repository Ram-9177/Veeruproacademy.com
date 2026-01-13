import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey, Prisma } from '@prisma/client'
import { notifyContentUpdated, notifyContentDeleted } from '@/lib/enhanced-realtime'
import { isAdminOrMentor } from '@/lib/auth-utils'

const outlineTopicSchema = z.object({
  title: z.string().min(1),
  subheading: z.string().optional(),
  sandboxContent: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

const outlineSectionSchema = z.object({
  heading: z.string().min(1),
  summary: z.string().optional(),
  topics: z.array(outlineTopicSchema).optional()
})

const metadataSchema = z.object({
  outline: z.array(outlineSectionSchema).optional()
}).catchall(z.any()).optional()

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().min(0).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  order: z.number().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  metadata: metadataSchema
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const { id } = params
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)
    const metadata: Prisma.InputJsonValue | undefined = data.metadata
      ? (JSON.parse(JSON.stringify(data.metadata)) as Prisma.InputJsonValue)
      : undefined

    // Get current course for version history
    const currentCourse = await prisma.course.findUnique({
      where: { id }
    })

    if (!currentCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        metadata,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined
      }
    })

    // Create version history
    const latestVersion = await prisma.contentVersion.findFirst({
      where: {
        contentType: 'COURSE',
        contentId: id
      },
      orderBy: { version: 'desc' }
    })

    await prisma.contentVersion.create({
      data: {
        contentType: 'COURSE',
        contentId: id,
        version: (latestVersion?.version || 0) + 1,
        data: updatedCourse as any,
        createdBy: (session.user as any).id,
        changeNote: `Updated course: ${data.title || currentCourse.title}`
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        // Cast to any to avoid mismatches between local enum types and generated Prisma enums.
        action: ('UPDATE' as any),
        contentType: 'COURSE',
        contentId: id,
        details: { fields: Object.keys(data) }
      }
    })

    // Broadcast course update in real-time
    await notifyContentUpdated('course', updatedCourse.title, updatedCourse.id, updatedCourse)

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error('Error updating course:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const { id } = params
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get course data before deletion for realtime broadcast
    const courseToDelete = await prisma.course.findUnique({
      where: { id }
    })

    if (!courseToDelete) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    await prisma.course.delete({
      where: { id }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: ('DELETE' as any),
        contentType: 'COURSE',
        contentId: id
      }
    })

    // Broadcast course deletion in real-time
    await notifyContentDeleted('course', courseToDelete.title, courseToDelete.id, courseToDelete)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
