import { NextResponse } from 'next/server'
import { RoleKey } from '@prisma/client'
import type { Prisma } from '@prisma/client'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { parseUnlockMetadata } from '@/src/modules/projects/helpers'
import { getProjectBySlug } from '@/src/modules/projects/service'
import type { ProjectUnlockMetadata } from '@/src/modules/projects/types'

export const dynamic = 'force-dynamic' as const

const VALID_STATUSES = new Set<AdminUpdateStatus>(['approved', 'rejected'])

type AdminUpdateStatus = 'approved' | 'rejected'

type UpdatePayload = {
  status: AdminUpdateStatus
  notes?: string | null
}

function applyAdminDecision(
  metadata: ProjectUnlockMetadata | null,
  status: AdminUpdateStatus,
  notes: string | null,
  verifierId: string,
): ProjectUnlockMetadata {
  const now = new Date().toISOString()

  const resolvedNotes = notes ?? metadata?.notes ?? undefined
  const resolvedProofUrl = metadata?.proofUrl ?? undefined
  const resolvedSubmittedAt = metadata?.submittedAt ?? now
  const resolvedSource = metadata?.source ?? 'manual'

  return {
    ...(metadata ?? {}),
    status,
    ...(resolvedNotes !== undefined ? { notes: resolvedNotes } : {}),
    ...(resolvedProofUrl !== undefined ? { proofUrl: resolvedProofUrl } : {}),
    submittedAt: resolvedSubmittedAt,
    source: resolvedSource,
    verifiedAt: now,
    verifierId,
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []

    if (!session?.user || !roles.includes(RoleKey.ADMIN)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as UpdatePayload

    if (!body || !VALID_STATUSES.has(body.status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }

    const savedItem = await prisma.savedItem.findUnique({ where: { id: params.id } })

    if (!savedItem) {
      return NextResponse.json({ success: false, error: 'Unlock request not found' }, { status: 404 })
    }

    const metadata = applyAdminDecision(
      parseUnlockMetadata(savedItem.metadata),
      body.status,
      body.notes ?? null,
      session.user.id,
    )

    const updated = await prisma.savedItem.update({
      where: { id: params.id },
  data: { metadata: metadata as Prisma.InputJsonValue },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
  action: ('UPDATE' as any),
  contentType: 'PROJECT',
        contentId: savedItem.itemId,
        details: {
          unlockId: savedItem.id,
          status: body.status,
        },
      },
    })

    let projectSummary = null
    const project = await prisma.project.findUnique({ where: { id: savedItem.itemId } })
    if (project?.slug) {
      projectSummary = await getProjectBySlug(project.slug, {
        userId: savedItem.userId,
        includeUnpublished: true,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        metadata,
        project: projectSummary,
      },
    })
  } catch (error) {
    console.error(`[api/admin/project-unlocks/${params.id}] Failed`, error)
    return NextResponse.json(
      { success: false, error: 'Unable to update project unlock status' },
      { status: 500 }
    )
  }
}
