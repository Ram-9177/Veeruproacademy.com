import { NextResponse } from 'next/server'
import { ProductType, ActivityType, ContentType } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getProjectBySlug } from '@/src/modules/projects/service'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'
import type { ProjectUnlockMetadata } from '@/src/modules/projects/types'

export const dynamic = 'force-dynamic' as const

function buildMetadata({
  status,
  proofUrl,
  notes,
  existing,
  submittedAt,
  verifierId,
}: {
  status: 'free' | 'pending' | 'approved' | 'rejected'
  proofUrl?: string | null
  notes?: string | null
  existing?: ProjectUnlockMetadata | null
  submittedAt?: string
  verifierId?: string
}) {
  return {
    ...(existing ?? {}),
    status,
    proofUrl: proofUrl ?? existing?.proofUrl ?? null,
    notes: notes ?? existing?.notes ?? null,
    submittedAt: submittedAt ?? existing?.submittedAt ?? new Date().toISOString(),
    verifierId: verifierId ?? existing?.verifierId ?? null,
    verifiedAt: status === 'approved' || status === 'rejected' ? new Date().toISOString() : existing?.verifiedAt ?? null,
    source: status === 'free' ? 'free' : 'manual',
  }
}

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

    const project = await prisma.project.findUnique({ where: { slug: params.slug } })

    if (!project || project.status !== 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    const uniqueKey = {
      userId_itemType_itemId: {
        userId,
        itemType: ProductType.PROJECT,
        itemId: project.id,
      },
    }

    const existing = await prisma.savedItem.findUnique({ where: uniqueKey })
    const existingMetadata = parseUnlockMetadata(existing?.metadata)

    if (project.price === 0) {
      const metadata = buildMetadata({ status: 'free', existing: existingMetadata ?? null })

      await prisma.savedItem.upsert({
        where: uniqueKey,
        update: { metadata },
        create: {
          userId,
          itemType: ProductType.PROJECT,
          itemId: project.id,
          metadata,
        },
      })

      await prisma.auditLog.create({
        data: {
          userId,
          action: ActivityType.CONTENT_EDIT as any,
          contentType: ContentType.PROJECT,
          contentId: project.id,
          details: { unlock: 'free-auto' },
        },
      })

      const summary = await getProjectBySlug(project.slug, { userId })
      return NextResponse.json({ success: true, data: summary })
    }

    if (existingMetadata?.status === 'approved') {
      const summary = await getProjectBySlug(project.slug, { userId })
      return NextResponse.json({ success: true, data: summary, message: 'Project already unlocked' })
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

    const metadata = buildMetadata({
      status: 'pending',
      proofUrl: proofUrl as string,
      notes,
      existing: existingMetadata ?? null,
      submittedAt: new Date().toISOString(),
    })

    const record = await prisma.savedItem.upsert({
      where: uniqueKey,
      update: { metadata },
      create: {
        userId,
        itemType: ProductType.PROJECT,
        itemId: project.id,
        metadata,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId,
        action: existing ? (ActivityType.CONTENT_EDIT as any) : (ActivityType.CONTENT_EDIT as any),
        contentType: ContentType.PROJECT,
        contentId: project.id,
        details: { unlock: 'pending', savedItemId: record.id },
      },
    })

    const summary = await getProjectBySlug(project.slug, { userId })
    return NextResponse.json({ success: true, data: summary })
  } catch (error) {
    console.error(`[api/projects/${params.slug}/unlock] Failed`, error)
    return NextResponse.json(
      { success: false, error: 'Unable to process unlock request' },
      { status: 500 }
    )
  }
}
