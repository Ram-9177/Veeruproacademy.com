import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { RoleKey, CmsPublishAction } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

const revertSchema = z.object({
  versionId: z.string().min(1),
})

function ensureAdmin(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && roles.includes(RoleKey.ADMIN))
}

export async function GET(_req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await auth()
    if (!ensureAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const raw = await prisma.cmsPageVersion.findMany({
      where: { pageId: params.pageId },
      orderBy: { version: 'desc' }
    })

    const userIds = Array.from(new Set(raw.map((r) => r.createdBy).filter(Boolean) as string[]))
    const users = userIds.length
      ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
      : []

    const userMap = new Map(users.map((u) => [u.id, { id: u.id, name: u.name, email: u.email }]))

    const versions = raw.map((v) => ({
      ...v,
      user: v.createdBy ? userMap.get(v.createdBy) ?? null : null
    }))

    return NextResponse.json({ success: true, data: versions })
  } catch (error) {
    console.error(`[api/cms/versions/${params.pageId}] Failed to list versions`, error)
    return NextResponse.json({ success: false, error: 'Unable to list versions' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { pageId: string } }) {
  try {
    const session = await auth()
    if (!ensureAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = revertSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const version = await prisma.cmsPageVersion.findUnique({
      where: { id: parsed.data.versionId },
    })

    if (!version || version.pageId !== params.pageId) {
      return NextResponse.json({ success: false, error: 'Version not found' }, { status: 404 })
    }

    const page = await prisma.cmsPage.findUnique({
      where: { id: params.pageId },
    })

    if (!page) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    // Get the latest version number
    const lastVersion = await prisma.cmsPageVersion.findFirst({
      where: { pageId: params.pageId },
      orderBy: { version: 'desc' },
    })

    const nextVersionNumber = (lastVersion?.version ?? 0) + 1

    // Create a new version with the reverted content
    await prisma.cmsPageVersion.create({
      data: {
        pageId: params.pageId,
        version: nextVersionNumber,
        status: page.status,
        data: version.data as any,
        createdBy: session.user.id,
        action: CmsPublishAction.UPDATE,
      },
    })

    // Log the revert action
    await prisma.cmsActivity.create({
      data: {
        pageId: params.pageId,
        userId: session.user.id,
        action: CmsPublishAction.UPDATE,
        notes: `Reverted to version ${version.version}`,
      },
    })

    return NextResponse.json({ success: true, message: 'Version restored successfully' })
  } catch (error) {
    console.error(`[api/cms/versions/${params.pageId}] Failed to revert version`, error)
    return NextResponse.json({ success: false, error: 'Unable to revert version' }, { status: 500 })
  }
}
