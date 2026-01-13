import { ProductType } from '@prisma/client'
import type { Prisma, Project as PrismaProject, SavedItem } from '@prisma/client'
import { prisma } from '@/lib/db'
import { parseUnlockMetadata, resolveUnlockStatus, ensureArray } from './helpers'
import type {
  ProjectListFilters,
  ProjectListOptions,
  ProjectListResult,
  ProjectSummary,
  ProjectUnlockMetadata,
} from './types'

function buildPrismaWhere(filters: ProjectListFilters, includeUnpublished?: boolean) {
  const where: Prisma.ProjectWhereInput = {}

  if (!includeUnpublished) {
    where.status = 'PUBLISHED'
  }

  if (filters.price === 'Free') {
    where.price = 0
  } else if (filters.price === 'Premium') {
    where.price = { gt: 0 }
  }

  if (filters.category) {
    where.category = {
      equals: filters.category,
      mode: 'insensitive',
    }
  }

  if (filters.search) {
    const search = filters.search.trim()
    if (search.length > 0) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }
  }

  return where
}

function mapPrismaProject(project: PrismaProject, metadata: ProjectUnlockMetadata | null): ProjectSummary {
  const unlockStatus = resolveUnlockStatus(project.price ?? 0, metadata)

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description ?? null,
    thumbnail: project.thumbnail ?? null,
    level: project.level ?? null,
    category: project.category ?? null,
    price: project.price ?? 0,
    tools: ensureArray<string>(project.tools),
    includes: ensureArray<string>(project.includes),
    featured: Boolean(project.featured),
    status: project.status ?? null,
    driveLink: unlockStatus === 'free' || unlockStatus === 'unlocked' ? project.driveUrl ?? null : null,
    upiId: project.upiId ?? null,
    formUrl: project.formUrl ?? null,
    unlockStatus,
    unlockMetadata: metadata,
    createdAt: project.createdAt ? project.createdAt.toISOString() : null,
    updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
  }
}

export async function listProjects(
  filters: ProjectListFilters = {},
  options: ProjectListOptions = {}
): Promise<ProjectListResult> {
  try {
    const where = buildPrismaWhere(filters, options.includeUnpublished)

  const projects: PrismaProject[] = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { price: 'desc' },
        { createdAt: 'desc' },
      ],
      take: options.limit,
    })

    let unlockMap = new Map<string, ProjectUnlockMetadata | null>()
    if (options.userId && projects.length > 0) {
      const savedItems: SavedItem[] = await prisma.savedItem.findMany({
        where: {
          userId: options.userId,
          itemType: ProductType.PROJECT,
          itemId: { in: projects.map((project) => project.id) },
        },
      })

      unlockMap = new Map(
        savedItems.map((item) => [
          item.itemId,
          parseUnlockMetadata(item.metadata) ?? null,
        ])
      )
    }

    const data = projects.map((project) =>
      mapPrismaProject(project, unlockMap.get(project.id) ?? null)
    )

    const total = await prisma.project.count({
      where: options.includeUnpublished ? {} : { status: 'PUBLISHED' },
    })

    return {
      data,
      count: data.length,
      total,
      source: 'database',
    }
  } catch (error) {
    console.error('[projects] Failed to fetch projects from database', error)
    
    return {
      data: [],
      count: 0,
      total: 0,
      source: 'database',
      fallbackReason: (error as Error).message,
    }
  }
}

export async function getProjectBySlug(
  slug: string,
  options: ProjectListOptions = {}
): Promise<ProjectSummary | null> {
  try {
    const project = await prisma.project.findUnique({ where: { slug } })

    if (!project) {
      return null
    }

    if (!options.includeUnpublished && project.status !== 'PUBLISHED') {
      return null
    }

    let metadata: ProjectUnlockMetadata | null = null

    if (options.userId) {
      const savedItem = await prisma.savedItem.findUnique({
        where: {
          userId_itemType_itemId: {
            userId: options.userId,
            itemType: ProductType.PROJECT,
            itemId: project.id,
          },
        },
      })

      metadata = parseUnlockMetadata(savedItem?.metadata) ?? null
    }

    return mapPrismaProject(project, metadata)
  } catch (error) {
    console.error(`[projects] Failed to fetch project ${slug} from database`, error)
    return null
  }
}
