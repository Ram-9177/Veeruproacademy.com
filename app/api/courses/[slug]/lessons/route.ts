import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

function normalizeJson<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }
  if (typeof value === 'object') {
    return value as T
  }
  return null
}

function normalizeQuizQuestions(raw: unknown): QuizQuestion[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as any).questions)
      ? (raw as any).questions
      : []

  return list
    .map((item: any, index: number) => {
      const options = Array.isArray(item?.options) ? item.options : Array.isArray(item?.choices) ? item.choices : []
      const correctIndex =
        typeof item?.correctIndex === 'number'
          ? item.correctIndex
          : typeof item?.answerIndex === 'number'
            ? item.answerIndex
            : options.findIndex((opt: string) => opt === item?.answer)

      return {
        id: item?.id || `${index + 1}`,
        question: item?.question || item?.prompt || '',
        options,
        correctIndex: correctIndex >= 0 ? correctIndex : 0,
        explanation: item?.explanation,
      }
    })
    .filter((q: QuizQuestion) => q.question && q.options.length > 0)
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: string[] } | null)?.roles ?? []
    const isAdmin = roles.includes('ADMIN') || roles.includes('MENTOR')
    
    // Find course by slug
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      select: { id: true, title: true, slug: true, status: true, metadata: true, price: true }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if course is published or user has admin access
    if (course.status !== 'PUBLISHED' && !isAdmin) {
      return NextResponse.json({ error: 'Course not available' }, { status: 403 })
    }

    const isPaid = typeof course.price === 'number' && course.price > 0
    if (isPaid && !session?.user?.id && !isAdmin) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (isPaid && session?.user?.id && !isAdmin) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: course.id,
          },
        },
      })

      if (!enrollment) {
        return NextResponse.json(
          {
            error: 'Enrollment required',
            redirect: `/courses/${course.slug}/payment`,
          },
          { status: 403 },
        )
      }
    }

    // Get lessons with content and topics
    const lessons = await prisma.lesson.findMany({
      where: { 
        courseId: course.id,
        status: isAdmin ? undefined : 'PUBLISHED'
      },
      include: {
        content: true,
        exercises: {
          orderBy: { order: 'asc' }
        },
        quizzes: true,
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
        },
        module: {
          select: { id: true, title: true, slug: true, order: true }
        }
      },
      orderBy: [
        { module: { order: 'asc' } },
        { order: 'asc' }
      ]
    })

    // Transform lessons to include parsed JSON fields
    const transformedLessons = lessons.map(lesson => ({
      ...lesson,
      content: lesson.content ? {
        ...lesson.content,
        codeExample: normalizeJson(lesson.content.codeExample)
      } : null,
      exercises: lesson.exercises.map((exercise: any) => ({
        ...exercise,
        starterCode: normalizeJson(exercise.starterCode) || { html: '', css: '', js: '' },
        solution: normalizeJson(exercise.solution) || { html: '', css: '', js: '' }
      })),
      topics: lesson.topics.map(topic => ({
        ...topic,
        subtopics: topic.subtopics.map(subtopic => ({
          ...subtopic,
          content: subtopic.content ? {
            ...subtopic.content,
            codeExample: normalizeJson(subtopic.content.codeExample)
          } : null,
          exercises: subtopic.exercises.map((exercise: any) => ({
            ...exercise,
            starterCode: normalizeJson(exercise.starterCode) || { html: '', css: '', js: '' },
            solution: normalizeJson(exercise.solution) || { html: '', css: '', js: '' }
          }))
        }))
      })),
      quizQuestions: lesson.quizzes.length > 0 ? normalizeQuizQuestions(lesson.quizzes[0].data) : []
    }))

    return NextResponse.json({ 
      course,
      lessons: transformedLessons 
    })
  } catch (error) {
    console.error('Error fetching course lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    const userRoles = (session?.user as { roles?: string[] } | null)?.roles ?? []

    if (!session?.user || !userRoles.includes('ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { moduleId, title, description, slug, order, estimatedMinutes, difficulty } = body

    // Find course by slug
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      select: { id: true }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Verify moduleData belongs to course
    if (moduleId) {
      const moduleData = await prisma.module.findFirst({
        where: { 
          id: moduleId,
          courseId: course.id
        }
      })

      if (!moduleData) {
        return NextResponse.json({ error: 'Module not found in this course' }, { status: 404 })
      }
    }

    // Check if lesson slug is unique
    const existingLesson = await prisma.lesson.findUnique({
      where: { slug }
    })

    if (existingLesson) {
      return NextResponse.json({ error: 'Lesson slug already exists' }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        moduleId: moduleId || null,
        title,
        description,
        slug,
        order: order || 0,
        estimatedMinutes: estimatedMinutes || null,
        difficulty: difficulty || null,
        status: 'DRAFT'
      },
      include: {
        content: true,
        exercises: true,
        topics: {
          include: {
            subtopics: {
              include: {
                content: true,
                exercises: true
              }
            }
          }
        },
        module: {
          select: { id: true, title: true, slug: true }
        }
      }
    })

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
