import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey } from '@prisma/client'
import { isAdminOrMentor } from '@/lib/auth-utils'

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
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

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        level: data.level ?? null,
        category: data.category ?? null,
        price: data.price ?? 0,
        tools: data.tools ?? [],
        includes: data.includes ?? [],
        driveUrl: data.driveUrl || null,
        upiId: data.upiId ?? null,
        formUrl: data.formUrl || null,
        status: data.status ?? 'DRAFT',
        featured: data.featured ?? false,
        thumbnail: data.thumbnail || null,
        metadata: data.metadata ?? null
      }
    })

    await prisma.contentVersion.create({
      data: {
        contentType: 'PROJECT',
        contentId: project.id,
        version: 1,
        data: project as any,
        createdBy: (session.user as any).id,
        changeNote: `Created project: ${project.title}`
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
  action: ('CREATE' as any),
        contentType: 'PROJECT',
        contentId: project.id,
        details: { slug: project.slug }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    if (error?.code === 'P1001') {
      return NextResponse.json([], { status: 200 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
