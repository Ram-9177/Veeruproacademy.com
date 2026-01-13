import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ActivityType, ContentType, CmsStatus, CmsPublishAction, RoleKey } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { extractPageContent, generateUniquePageSlug, summarizeContent } from '@/lib/cms-pages'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.string().optional(),
  status: z.nativeEnum(CmsStatus).optional(),
})

function ensureAdmin(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && roles.includes(RoleKey.ADMIN))
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.cmsPage.findUnique({
      where: { id: params.id },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    })

    if (!page) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    const latestVersion = page.versions[0] ?? null
    const content = extractPageContent(page.versions)

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        content,
        latestVersion,
        published: page.isPublished,
      },
    })
  } catch (error) {
    console.error(`[api/cms/pages/${params.id}] Failed to fetch page`, error)
    return NextResponse.json({ success: false, error: 'Unable to fetch page' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const existing = await prisma.cmsPage.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    const { title, slug, content, status } = parsed.data

    let nextSlug = existing.slug
    if (slug && slug !== existing.slug) {
      if (existing.isPublished) {
        return NextResponse.json({ success: false, error: 'Slug cannot be changed after publish' }, { status: 400 })
      }
      nextSlug = await generateUniquePageSlug(slug, existing.id)
    }

    const now = new Date()
    const nextStatus = status ?? existing.status
    const isPublished = nextStatus === CmsStatus.PUBLISHED
    const statusChanged = existing.status !== nextStatus || existing.isPublished !== isPublished
    const latestVersion = await prisma.cmsPageVersion.findFirst({
      where: { pageId: params.id },
      orderBy: { version: 'desc' },
    })
    const latestContent = extractPageContent(latestVersion ? [latestVersion] : undefined)
    const contentValue = typeof content === 'string' ? content : latestContent

    const updated = await prisma.cmsPage.update({
      where: { id: params.id },
      data: {
        title: title ?? existing.title,
        slug: nextSlug,
        status: nextStatus,
        isPublished,
        description: typeof content === 'string' ? summarizeContent(content) : existing.description,
        publishedAt: isPublished ? existing.publishedAt ?? now : null,
      },
    })

    // If content or status changed, create a new version entry
    if (typeof content === 'string' || statusChanged) {
      const nextVersionNumber = (latestVersion?.version ?? 0) + 1
      const publishAction = !existing.isPublished && isPublished
        ? CmsPublishAction.PUBLISH
        : existing.isPublished && !isPublished
          ? CmsPublishAction.UNPUBLISH
          : CmsPublishAction.UPDATE

      await prisma.cmsPageVersion.create({
        data: {
          pageId: params.id,
          version: nextVersionNumber,
          status: nextStatus,
          data: { content: contentValue },
    createdBy: (session.user as { id: string }).id,
          action: publishAction,
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: ActivityType.CONTENT_EDIT as any,
        contentType: ContentType.FAQ,
        contentId: updated.id,
        details: { cmsPageId: updated.id, title: updated.title, status: updated.status },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        slug: nextSlug,
        content: contentValue,
        published: updated.isPublished,
      },
    })
  } catch (error) {
    console.error(`[api/cms/pages/${params.id}] Failed to update page`, error)
    return NextResponse.json({ success: false, error: 'Unable to update page' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!ensureAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.cmsPage.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    await prisma.cmsPageVersion.deleteMany({ where: { pageId: params.id } })
    await prisma.cmsActivity.deleteMany({ where: { pageId: params.id } })

    await prisma.auditLog.deleteMany({
      where: {
        contentType: ContentType.FAQ,
        contentId: params.id,
      },
    })

    await prisma.cmsPage.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[api/cms/pages/${params.id}] Failed to delete page`, error)
    return NextResponse.json({ success: false, error: 'Unable to delete page' }, { status: 500 })
  }
}
