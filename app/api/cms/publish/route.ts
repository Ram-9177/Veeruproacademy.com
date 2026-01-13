import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CmsPublishAction, CmsStatus, RoleKey } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { extractPageContent, generateUniquePageSlug, summarizeContent } from '@/lib/cms-pages'

const publishSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().optional(),
  publish: z.boolean().default(true),
})

function ensureAdmin(session: any): session is { user: { id: string; roles?: RoleKey[] } } {
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  return Boolean(session?.user && roles.includes(RoleKey.ADMIN))
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!ensureAdmin(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = publishSchema.parse(await req.json())
    const existing = body.id
      ? await prisma.cmsPage.findUnique({
          where: { id: body.id },
          include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
        })
      : null

    if (body.id && !existing) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    const desiredSlug = body.slug || existing?.slug || body.title

    if (existing?.isPublished && desiredSlug !== existing.slug) {
      return NextResponse.json(
        { success: false, error: 'Slug cannot be changed after publish' },
        { status: 400 }
      )
    }

    const resolvedSlug = await generateUniquePageSlug(desiredSlug, existing?.id)

    const nextStatus = body.publish ? CmsStatus.PUBLISHED : CmsStatus.DRAFT
    const contentValue =
      typeof body.content === 'string' ? body.content : extractPageContent(existing?.versions)

    const page = existing
      ? await prisma.cmsPage.update({
          where: { id: existing.id },
          data: {
            title: body.title,
            slug: resolvedSlug,
            status: nextStatus,
            isPublished: body.publish,
            description: summarizeContent(contentValue),
            publishedAt: body.publish ? existing.publishedAt ?? new Date() : null,
          },
        })
      : await prisma.cmsPage.create({
          data: {
            title: body.title,
            slug: resolvedSlug,
            status: nextStatus,
            isPublished: body.publish,
            description: summarizeContent(contentValue),
            publishedAt: body.publish ? new Date() : null,
            authorId: (session.user as any).id,
          },
        })

    const lastVersion = await prisma.cmsPageVersion.findFirst({
      where: { pageId: page.id },
      orderBy: { version: 'desc' },
    })

    const nextVersionNumber = (lastVersion?.version ?? 0) + 1
    const action = body.publish ? CmsPublishAction.PUBLISH : CmsPublishAction.UNPUBLISH

    await prisma.cmsPageVersion.create({
      data: {
        pageId: page.id,
        version: nextVersionNumber,
        status: nextStatus,
        data: { content: contentValue },
        createdBy: (session.user as any).id,
        action,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        slug: resolvedSlug,
        content: contentValue,
        published: page.isPublished,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    console.error('[api/cms/publish] Failed to publish page', error)
    return NextResponse.json({ success: false, error: 'Unable to publish page' }, { status: 500 })
  }
}
