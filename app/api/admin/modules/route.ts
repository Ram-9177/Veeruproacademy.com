import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { RoleKey } from '@prisma/client'

const createModuleSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  order: z.number().optional()
})

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    const where = courseId ? { courseId } : {}

    const modules = await prisma.module.findMany({
      where,
      include: {
        course: {
          select: { id: true, title: true, slug: true }
        },
        lessons: {
          select: { id: true, title: true, slug: true, order: true, status: true }
        },
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' }
      ]
    })

    return NextResponse.json({ modules })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createModuleSchema.parse(body)

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if slug is unique within the course
    const existingModule = await prisma.module.findFirst({
      where: {
        courseId: data.courseId,
        slug: data.slug
      }
    })

    if (existingModule) {
      return NextResponse.json({ error: 'Module slug already exists in this course' }, { status: 400 })
    }

    const moduleData = await prisma.module.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        order: data.order ?? 0
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true }
        },
        _count: {
          select: { lessons: true }
        }
      }
    })

    return NextResponse.json({ module: moduleData }, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}