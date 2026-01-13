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
  body: z.string().optional(),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  estimatedMinutes: z.number().min(1).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  courseId: z.string().optional().nullable(),
  moduleId: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
  order: z.number().min(0).optional(),
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

    const lessonData: Record<string, unknown> = {
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      body: data.body ?? null,
      youtubeUrl: data.youtubeUrl || null,
      estimatedMinutes: data.estimatedMinutes ?? null,
      difficulty: data.difficulty ?? null,
      status: data.status ?? 'DRAFT',
      order: data.order ?? 0,
      metadata: data.metadata ?? null
    }

    if (data.courseId) {
      lessonData.courseId = data.courseId
    }

    if (data.moduleId) {
      lessonData.moduleId = data.moduleId
    }

    const lesson = await prisma.lesson.create({
      data: lessonData as any
    })

    await prisma.contentVersion.create({
      data: {
        contentType: 'LESSON',
        contentId: lesson.id,
        version: 1,
        data: lesson as any,
        createdBy: (session.user as any).id,
        changeNote: `Created lesson: ${lesson.title}`
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
  action: ('CREATE' as any),
        contentType: 'LESSON',
        contentId: lesson.id,
        details: { slug: lesson.slug }
      }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
