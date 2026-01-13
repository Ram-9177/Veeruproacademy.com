import { NextResponse } from 'next/server'
import { z } from 'zod'
import { CmsPublishAction, CmsStatus, Prisma } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { extractPageContent, generateUniquePageSlug, summarizeContent } from '@/lib/cms-pages'

const createPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  content: z.string().default(''),
  description: z.string().optional(),
  status: z.nativeEnum(CmsStatus).default(CmsStatus.DRAFT),
})

const listQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'draft', 'published']).optional(),
})

function requireAdminSession(session: any) {
  const roles = (session?.user as { roles?: string[] } | null)?.roles ?? []
  if (!session?.user || !roles.includes('ADMIN')) {
    return false
  }
  return true
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!requireAdminSession(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parsed = listQuerySchema.safeParse({
      search: searchParams.get('search') ?? undefined,
      status: (searchParams.get('status') as any) ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid query' }, { status: 400 })
    }

    const where: Prisma.CmsPageWhereInput = {}

    if (parsed.data.status === 'draft') {
      where.status = CmsStatus.DRAFT
    } else if (parsed.data.status === 'published') {
      where.status = CmsStatus.PUBLISHED
    }

    if (parsed.data.search) {
      where.OR = [
        { title: { contains: parsed.data.search, mode: 'insensitive' } },
        { slug: { contains: parsed.data.search, mode: 'insensitive' } },
      ]
    }

    const pages = await prisma.cmsPage.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    })

    const data = pages.map((page) => {
      const { versions, ...rest } = page
      const content = extractPageContent(versions)
      return {
        ...rest,
        content,
        published: rest.isPublished,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[api/cms/pages] Failed to list pages', error)
    return NextResponse.json({ success: false, error: 'Unable to list pages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!requireAdminSession(session)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const parsed = createPageSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const { title, slug, content, status } = parsed.data
    const resolvedSlug = await generateUniquePageSlug(slug || title)
    const isPublished = status === CmsStatus.PUBLISHED
    const description = parsed.data.description ?? summarizeContent(content)

    const page = await prisma.cmsPage.create({
      data: {
        title,
        slug: resolvedSlug,
        description,
        status,
        isPublished: isPublished,
        publishedAt: isPublished ? new Date() : null,
        seo: Prisma.JsonNull,
        blocks: Prisma.JsonNull,
        metadata: Prisma.JsonNull,
        authorId: (session?.user as any)?.id ?? null,
      },
    })

    await prisma.cmsPageVersion.create({
      data: {
        pageId: page.id,
        version: 1,
        status,
        data: { content },
        createdBy: (session?.user as any)?.id ?? null,
        action: isPublished ? CmsPublishAction.PUBLISH : CmsPublishAction.CREATE,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...page,
        slug: resolvedSlug,
        content,
        published: page.isPublished,
      },
    })
  } catch (error) {
    console.error('[api/cms/pages] Failed to create page', error)
    return NextResponse.json({ success: false, error: 'Unable to create page' }, { status: 500 })
  }
}
