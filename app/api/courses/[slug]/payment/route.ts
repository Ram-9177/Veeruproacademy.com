import { NextResponse } from 'next/server'
import { ProductType, type Prisma } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'
import type { ProjectUnlockMetadata } from '@/src/modules/projects/types'

export const dynamic = 'force-dynamic'

type PaymentStatus = 'none' | 'pending' | 'approved' | 'rejected'

function isValidProofUrl(value: unknown) {
  if (typeof value !== 'string') return false
  if (!value.trim()) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function buildMetadata({
  status,
  proofUrl,
  notes,
  existing,
  submittedAt,
  verifierId,
}: {
  status: 'pending' | 'approved' | 'rejected' | 'free'
  proofUrl?: string | null
  notes?: string | null
  existing?: ProjectUnlockMetadata | null
  submittedAt?: string
  verifierId?: string | null
}) {
  return {
    ...(existing ?? {}),
    status,
    proofUrl: proofUrl ?? existing?.proofUrl ?? undefined,
    notes: notes ?? existing?.notes ?? undefined,
    submittedAt: submittedAt ?? existing?.submittedAt ?? new Date().toISOString(),
    verifierId: verifierId ?? existing?.verifierId ?? undefined,
    verifiedAt: status === 'approved' || status === 'rejected' ? new Date().toISOString() : (existing?.verifiedAt ?? undefined),
    source: (status === 'free' ? 'free' : 'manual') as 'free' | 'manual' | undefined,
  }
}

function toResponse(metadata: ProjectUnlockMetadata | null): { status: PaymentStatus; proofUrl: string | null; notes: string | null; submittedAt: string | null } {
  if (!metadata) {
    return { status: 'none', proofUrl: null, notes: null, submittedAt: null }
  }

  return {
    status: (metadata.status as PaymentStatus) ?? 'pending',
    proofUrl: metadata.proofUrl ?? null,
    notes: metadata.notes ?? null,
    submittedAt: metadata.submittedAt ?? null,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      select: { id: true, slug: true, status: true, price: true },
    })

    if (!course || course.status !== 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    if (!course.price || course.price <= 0) {
      return NextResponse.json({ success: true, data: { status: 'free' } })
    }

    const savedItem = await prisma.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: ProductType.COURSE,
          itemId: course.id,
        },
      },
    })

    const metadata = parseUnlockMetadata(savedItem?.metadata as Prisma.JsonValue | null)
    return NextResponse.json({ success: true, data: toResponse(metadata) })
  } catch (error) {
    console.error(`[api/courses/${params.slug}/payment] Failed to fetch payment status`, error)
    return NextResponse.json(
      { success: false, error: 'Unable to fetch payment status' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      select: { id: true, slug: true, status: true, price: true },
    })

    if (!course || course.status !== 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    if (!course.price || course.price <= 0) {
      return NextResponse.json({ success: false, error: 'Course is free' }, { status: 400 })
    }

    let payload: { proofUrl?: unknown; notes?: unknown } | null = null
    try {
      payload = (await request.json()) as { proofUrl?: unknown; notes?: unknown }
    } catch (_error) {
      return NextResponse.json({ success: false, error: 'Expected JSON payload' }, { status: 400 })
    }

    const proofUrl = payload?.proofUrl
    const notes = typeof payload?.notes === 'string' ? payload.notes : null

    if (!isValidProofUrl(proofUrl)) {
      return NextResponse.json({ success: false, error: 'Valid payment proof URL is required' }, { status: 400 })
    }

    const uniqueKey = {
      userId_itemType_itemId: {
        userId,
        itemType: ProductType.COURSE,
        itemId: course.id,
      },
    }

    const existing = await prisma.savedItem.findUnique({ where: uniqueKey })
    const existingMetadata = parseUnlockMetadata(existing?.metadata as Prisma.JsonValue | null)

    if (existingMetadata?.status === 'approved') {
      return NextResponse.json({ success: true, data: toResponse(existingMetadata) })
    }

    const metadata = buildMetadata({
      status: 'pending',
      proofUrl: proofUrl as string,
      notes,
      existing: existingMetadata ?? null,
      submittedAt: new Date().toISOString(),
    })

    await prisma.savedItem.upsert({
      where: uniqueKey,
      update: { metadata },
      create: {
        userId,
        itemType: ProductType.COURSE,
        itemId: course.id,
        metadata,
      },
    })

    return NextResponse.json({ success: true, data: toResponse(metadata) })
  } catch (error) {
    console.error(`[api/courses/${params.slug}/payment] Failed to submit payment`, error)
    return NextResponse.json(
      { success: false, error: 'Unable to submit payment' },
      { status: 500 },
    )
  }
}
