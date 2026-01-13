import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CmsPublishAction, CmsStatus, RoleKey } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { generateUniquePageSlug, summarizeContent } from '@/lib/cms-pages'

const draftSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().default(''),
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

    const body = draftSchema.parse(await req.json())
    const existing = body.id ? await prisma.cmsPage.findUnique({ where: { id: body.id } }) : null

    if (body.id && !existing) {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }

    if (existing?.isPublished && body.slug && body.slug !== existing.slug) {
      return NextResponse.json({ success: false, error: 'Slug cannot be changed after publish' }, { status: 400 })
    }

    const resolvedSlug = await generateUniquePageSlug(body.slug || body.title, existing?.id)
    const nextStatus = existing?.status === CmsStatus.PUBLISHED ? CmsStatus.PUBLISHED : CmsStatus.DRAFT
    const isPublished = existing?.isPublished ?? false

    const page = existing
      ? await prisma.cmsPage.update({
          where: { id: existing.id },
          data: {
            title: body.title,
            slug: resolvedSlug,
            description: summarizeContent(body.content),
            status: nextStatus,
            isPublished,
            publishedAt: isPublished ? existing.publishedAt ?? new Date() : null,
          },
        })
      : await prisma.cmsPage.create({
          data: {
            title: body.title,
            slug: resolvedSlug,
            description: summarizeContent(body.content),
            status: CmsStatus.DRAFT,
            isPublished: false,
            publishedAt: null,
            authorId: (session.user as any).id,
          },
        })

    const lastVersion = await prisma.cmsPageVersion.findFirst({
      where: { pageId: page.id },
      orderBy: { version: 'desc' },
    })

    const nextVersionNumber = (lastVersion?.version ?? 0) + 1

    await prisma.cmsPageVersion.create({
      data: {
        pageId: page.id,
        version: nextVersionNumber,
        status: page.status,
        data: { content: body.content },
        createdBy: (session.user as any).id,
        action: existing ? CmsPublishAction.UPDATE : CmsPublishAction.CREATE,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        slug: resolvedSlug,
        content: body.content,
        published: page.isPublished,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    console.error('[api/cms/save-draft] Failed to save draft', error)
    return NextResponse.json({ success: false, error: 'Unable to save draft' }, { status: 500 })
  }
}
