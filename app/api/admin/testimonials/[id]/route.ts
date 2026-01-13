import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ActivityType, CmsStatus, ContentType, RoleKey } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { isAdminOrMentor } from '@/lib/auth-utils'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional().nullable(),
  quote: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  highlight: z.string().optional().nullable(),
  rating: z.number().min(1).max(5).optional(),
  status: z.nativeEnum(CmsStatus).optional(),
  order: z.number().min(0).optional()
})

function ensureAdminOrMentor(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && isAdminOrMentor(roles))
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const testimonial = await prisma.testimonial.findUnique({ where: { id: params.id } })
    if (!testimonial) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }
    const data = parsed.data

    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    const updatePayload: Record<string, unknown> = {}
    if (data.name !== undefined) updatePayload.name = data.name
    if (data.role !== undefined) updatePayload.role = data.role ?? null
    if (data.quote !== undefined) updatePayload.quote = data.quote
    if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl || null
    if (data.highlight !== undefined) updatePayload.highlight = data.highlight ?? null
    if (data.rating !== undefined) updatePayload.rating = data.rating
    if (data.status !== undefined) updatePayload.status = data.status
    if (data.order !== undefined) updatePayload.order = data.order

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updatePayload as any
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as { id: string }).id,
        action: ActivityType.CONTENT_EDIT as any,
        contentType: ContentType.TESTIMONIAL,
        contentId: id,
        details: { fields: Object.keys(data) }
      }
    })

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const existing = await prisma.testimonial.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    await prisma.testimonial.delete({
      where: { id }
    })

    await prisma.auditLog.create({
      data: {
        userId: (session.user as { id: string }).id,
        action: ActivityType.CONTENT_EDIT as any,
        contentType: ContentType.TESTIMONIAL,
        contentId: id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
