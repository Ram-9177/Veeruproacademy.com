import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey, ContentStatus, Prisma } from '@prisma/client'
import { isAdminOrMentor } from '@/lib/auth-utils'

const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().min(1).optional(),
  estimatedMinutes: z.number().optional(),
  difficulty: z.string().optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  order: z.number().optional(),
  content: z.object({
    type: z.enum(['reading', 'video', 'exercise', 'project']).optional(),
    theory: z.string().optional(),
    videoUrl: z.string().optional(),
    youtubeId: z.string().optional(),
    duration: z.string().optional(),
    codeExample: z.object({
      html: z.string().optional(),
      css: z.string().optional(),
      js: z.string().optional()
    }).optional()
  }).optional(),
  exercises: z.array(z.object({
    title: z.string(),
    description: z.string(),
    starterCode: z.object({
      html: z.string().optional(),
      css: z.string().optional(),
      js: z.string().optional()
    }),
    solution: z.object({
      html: z.string().optional(),
      css: z.string().optional(),
      js: z.string().optional()
    }),
    hints: z.array(z.string()).optional()
  })).optional()
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        content: true,
        exercises: true,
        course: {
          select: { id: true, title: true, slug: true }
        },
        module: {
          select: { id: true, title: true, slug: true }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error fetching lesson:', error)
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

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateLessonSchema.parse(body)

    const result = await prisma.$transaction(async (tx) => {
      // Update lesson basic info
      const lesson = await tx.lesson.update({
        where: { id: params.id },
        data: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          estimatedMinutes: data.estimatedMinutes,
          difficulty: data.difficulty,
          status: data.status,
          order: data.order
        }
      })

      // Update or create lesson content
      if (data.content) {
        await tx.lessonContent.upsert({
          where: { lessonId: params.id },
          update: {
            type: data.content.type || 'reading',
            theory: data.content.theory,
            videoUrl: data.content.videoUrl,
            youtubeId: data.content.youtubeId,
            duration: data.content.duration,
            codeExample: data.content.codeExample ?? Prisma.DbNull
          },
          create: {
            lessonId: params.id,
            type: data.content.type || 'reading',
            theory: data.content.theory,
            videoUrl: data.content.videoUrl,
            youtubeId: data.content.youtubeId,
            duration: data.content.duration,
            codeExample: data.content.codeExample ?? Prisma.DbNull
          }
        })
      }

      // Update exercises
      if (data.exercises) {
        // Delete existing exercises
        await tx.lessonExercise.deleteMany({
          where: { lessonId: params.id }
        })

        // Create new exercises
        if (data.exercises.length > 0) {
          await tx.lessonExercise.createMany({
            data: data.exercises.map((exercise, index) => ({
              lessonId: params.id,
              title: exercise.title,
              description: exercise.description,
              starterCode: exercise.starterCode,
              solution: exercise.solution,
              hints: exercise.hints || [],
              order: index
            }))
          })
        }
      }

      return lesson
    })

    return NextResponse.json({ lesson: result })
  } catch (error) {
    console.error('Error updating lesson:', error)
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

    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.lesson.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
