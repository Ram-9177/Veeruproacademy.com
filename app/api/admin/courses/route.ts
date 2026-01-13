import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { ActivityType, ContentStatus, ContentType, RoleKey, Prisma } from '@prisma/client'
import { notifyContentCreated } from '@/lib/enhanced-realtime'
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

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().min(0).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  order: z.number().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  metadata: metadataSchema
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
  const userId = (session.user as { id: string }).id
    const metadata: Prisma.InputJsonValue | undefined = data.metadata
      ? (JSON.parse(JSON.stringify(data.metadata)) as Prisma.InputJsonValue)
      : undefined

    // Use transaction to ensure atomicity: all-or-nothing
    // If any step fails, entire operation is rolled back
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create the course
      const course = await tx.course.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description ?? null,
          level: data.level ?? null,
          duration: data.duration ?? null,
          price: data.price ?? 0,
          status: data.status ?? ContentStatus.DRAFT,
          thumbnail: data.thumbnail || null,
          order: data.order ?? 0,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
          metadata: metadata ?? undefined,
          instructorId: userId
        }
      })

      // Step 2: Create version record
      await tx.contentVersion.create({
        data: {
          contentType: ContentType.COURSE,
          contentId: course.id,
          version: 1,
    data: course,
          createdBy: userId,
          changeNote: `Created course: ${course.title}`
        }
      })

      // Step 3: Create audit log
      await tx.auditLog.create({
        data: {
          userId: userId,
          action: ActivityType.CONTENT_EDIT as any,
          contentType: ContentType.COURSE,
          contentId: course.id,
          details: { slug: course.slug }
        }
      })

      return course
    }, {
      // Transaction options for better reliability
      timeout: 10000, // 10 second timeout
      maxWait: 5000   // Max wait for connection
    })

    // Broadcast the course creation in real-time
    await notifyContentCreated('course', result.title, result.id, result)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating course:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    // Distinguish transaction errors
    if (error instanceof Error && error.message.includes('transaction')) {
      return NextResponse.json(
        { error: 'Database operation failed. Please try again.' },
        { status: 500 }
      )
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

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { lessons: true, modules: true }
        }
      }
    })

    return NextResponse.json({ courses })
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    // Graceful fallback when DB is unreachable so UI can still render
    if (error?.code === 'P1001') {
      return NextResponse.json({ courses: [], warning: 'Database unreachable; showing empty list.' }, { status: 200 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
