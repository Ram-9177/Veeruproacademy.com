import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey } from '@prisma/client'
import { isAdminOrMentor } from '@/lib/auth-utils'

// Validation schemas
const SubtopicContentSchema = z.object({
  type: z.enum(['reading', 'video', 'exercise', 'project']).default('reading'),
  theory: z.string().optional(),
  videoUrl: z.string().optional(),
  youtubeId: z.string().optional(),
  duration: z.string().optional(),
  codeExample: z.object({
    html: z.string().optional(),
    css: z.string().optional(),
    js: z.string().optional()
  }).optional()
})

const SubtopicExerciseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
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
  hints: z.array(z.string()).default([])
})

const SubtopicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().min(0),
  estimatedMinutes: z.number().int().min(1).default(5),
  content: SubtopicContentSchema.optional(),
  exercises: z.array(SubtopicExerciseSchema).default([])
})

const TopicSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().min(0),
  estimatedMinutes: z.number().int().min(1).default(15),
  subtopics: z.array(SubtopicSchema).default([])
})

const TopicsUpdateSchema = z.object({
  topics: z.array(TopicSchema)
})

// GET - Fetch lesson with topics and subtopics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessonId = params.id

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        topics: {
          orderBy: { order: 'asc' },
          include: {
            subtopics: {
              orderBy: { order: 'asc' },
              include: {
                content: {
                  include: {
                    blocks: {
                      orderBy: { order: 'asc' }
                    }
                  }
                },
                exercises: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error('Error fetching lesson topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson topics' },
      { status: 500 }
    )
  }
}

// PUT - Update lesson topics and subtopics
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    if (!session?.user || !isAdminOrMentor(roles)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessonId = params.id
    const body = await request.json()
    
    // Validate request body
    const validatedData = TopicsUpdateSchema.parse(body)

    // Start transaction to update topics and subtopics
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing topics and their subtopics (cascade will handle subtopics)
      await tx.lessonTopic.deleteMany({
        where: { lessonId }
      })

      // Create new topics with subtopics
      for (const topicData of validatedData.topics) {
        const topic = await tx.lessonTopic.create({
          data: {
            lessonId,
            title: topicData.title,
            description: topicData.description,
            order: topicData.order,
            estimatedMinutes: topicData.estimatedMinutes
          }
        })

        // Create subtopics for this topic
        for (const subtopicData of topicData.subtopics) {
          const subtopic = await tx.lessonSubtopic.create({
            data: {
              topicId: topic.id,
              title: subtopicData.title,
              description: subtopicData.description,
              order: subtopicData.order,
              estimatedMinutes: subtopicData.estimatedMinutes
            }
          })

          // Create subtopic content if provided
          if (subtopicData.content) {
            await tx.subtopicContent.create({
              data: {
                subtopicId: subtopic.id,
                type: subtopicData.content.type,
                theory: subtopicData.content.theory,
                videoUrl: subtopicData.content.videoUrl,
                youtubeId: subtopicData.content.youtubeId,
                duration: subtopicData.content.duration,
                codeExample: subtopicData.content.codeExample
              }
            })
          }

          // Create subtopic exercises if provided
          for (const exerciseData of subtopicData.exercises) {
            await tx.subtopicExercise.create({
              data: {
                subtopicId: subtopic.id,
                title: exerciseData.title,
                description: exerciseData.description,
                starterCode: exerciseData.starterCode,
                solution: exerciseData.solution,
                hints: exerciseData.hints,
                order: subtopicData.exercises.indexOf(exerciseData)
              }
            })
          }
        }
      }

      // Return updated lesson with topics
      return await tx.lesson.findUnique({
        where: { id: lessonId },
        include: {
          topics: {
            orderBy: { order: 'asc' },
            include: {
              subtopics: {
                orderBy: { order: 'asc' },
                include: {
                  content: true,
                  exercises: {
                    orderBy: { order: 'asc' }
                  }
                }
              }
            }
          }
        }
      })
    })

    return NextResponse.json({ 
      message: 'Lesson topics updated successfully',
      lesson: result
    })
  } catch (error) {
    console.error('Error updating lesson topics:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update lesson topics' },
      { status: 500 }
    )
  }
}
