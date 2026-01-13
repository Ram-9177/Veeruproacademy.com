import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey } from '@prisma/client'
import { isAdminOrMentor } from '@/lib/auth-utils'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  price: z.number().min(0).optional(),
  tools: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  driveUrl: z.string().url().optional().or(z.literal('')),
  upiId: z.string().optional(),
  formUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
  featured: z.boolean().optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  metadata: z.any().optional()
})

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const data = updateSchema.parse(body)

    const currentProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? currentProject.description,
        driveUrl: data.driveUrl ?? currentProject.driveUrl,
        formUrl: data.formUrl ?? currentProject.formUrl,
        thumbnail: data.thumbnail ?? currentProject.thumbnail
      }
    })

    const latestVersion = await prisma.contentVersion.findFirst({
      where: {
        contentType: 'PROJECT',
        contentId: id
      },
      orderBy: { version: 'desc' }
    })

    await prisma.contentVersion.create({
      data: {
        contentType: 'PROJECT',
        contentId: id,
        version: (latestVersion?.version || 0) + 1,
        data: updatedProject as any,
        createdBy: (session.user as any).id,
        changeNote: `Updated project: ${data.title || currentProject.title}`
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
  action: ('UPDATE' as any),
        contentType: 'PROJECT',
        contentId: id,
        details: { fields: Object.keys(data) }
      }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.project.delete({
      where: { id }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
  action: ('DELETE' as any),
        contentType: 'PROJECT',
        contentId: id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
