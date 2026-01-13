import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { RoleKey } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { isAdminOrMentor } from '@/lib/auth-utils'

const listQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
})

const createMediaSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().min(0),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  alt: z.string().optional(),
})

function ensureAdminOrMentor(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && isAdminOrMentor(roles))
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parsed = listQuerySchema.safeParse({
      search: searchParams.get('search') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid query' }, { status: 400 })
    }

    const { search, page, limit } = parsed.data
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { filename: { contains: search, mode: 'insensitive' as const } },
            { originalName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: media,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[api/cms/media] Failed to list media', error)
    return NextResponse.json({ success: false, error: 'Unable to list media' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!ensureAdminOrMentor(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const parsed = createMediaSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const media = await prisma.media.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    console.error('[api/cms/media] Failed to create media', error)
    return NextResponse.json({ success: false, error: 'Unable to create media' }, { status: 500 })
  }
}
