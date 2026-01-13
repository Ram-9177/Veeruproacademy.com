import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { RoleKey, CmsStatus, ActivityType, ContentType } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminOrMentor } from '@/lib/auth-utils'

const createSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  quote: z.string().min(1),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  highlight: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  status: z.nativeEnum(CmsStatus).optional(),
  order: z.number().min(0).optional()
})

function ensureAdminOrMentor(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && isAdminOrMentor(roles))
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const json = await req.json()
    const parsed = createSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role ?? null,
        quote: data.quote,
        avatarUrl: data.avatarUrl || null,
        highlight: data.highlight ?? null,
        rating: data.rating ?? 5,
        status: data.status ?? 'PUBLISHED',
        order: data.order ?? 0
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as { id: string }).id,
        action: ActivityType.CONTENT_EDIT as any,
        contentType: ContentType.TESTIMONIAL,
        contentId: testimonial.id,
        details: { name: testimonial.name }
      }
    })

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
