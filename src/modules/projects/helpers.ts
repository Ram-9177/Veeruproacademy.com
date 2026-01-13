import type { Prisma } from '@prisma/client'
import type { ProjectUnlockMetadata, ProjectUnlockStatus, ProjectSummary } from './types'

type StaticProject = {
  slug: string
  title: string
  description: string
  thumbnail: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  price: number
  tools: string[]
  includes: string[]
  driveUrl: string
  upiId: string
  formUrl: string
}

export function parseUnlockMetadata(metadata: Prisma.JsonValue | null | undefined): ProjectUnlockMetadata | null {
  if (!metadata) {
    return null
  }

  if (typeof metadata === 'object' && !Array.isArray(metadata)) {
    const candidate = metadata as Record<string, unknown>
    const status = typeof candidate.status === 'string' ? candidate.status : undefined
    return {
      ...(candidate as Record<string, unknown>),
      status: (status as ProjectUnlockMetadata['status']) ?? 'pending',
    }
  }

  return null
}

export function resolveUnlockStatus(price: number, metadata: ProjectUnlockMetadata | null): ProjectUnlockStatus {
  if (price === 0) {
    return 'free'
  }

  if (!metadata) {
    return 'locked'
  }

  switch (metadata.status) {
    case 'approved':
      return 'unlocked'
    case 'pending':
      return 'pending'
    case 'rejected':
      return 'locked'
    case 'free':
      return 'free'
    default:
      return 'locked'
  }
}

export function mapStaticProject(project: StaticProject): ProjectSummary {
  const unlockStatus: ProjectUnlockStatus = project.price === 0 ? 'free' : 'locked'

  return {
    id: project.slug,
    slug: project.slug,
    title: project.title,
    description: project.description,
    thumbnail: project.thumbnail,
    level: project.level,
    category: project.category,
    price: project.price,
    tools: project.tools,
    includes: project.includes,
    featured: project.price > 500,
    status: 'PUBLISHED',
    driveLink: unlockStatus === 'free' ? project.driveUrl ?? null : null,
    upiId: project.upiId ?? null,
    formUrl: project.formUrl ?? null,
    unlockStatus,
    unlockMetadata: unlockStatus === 'free' ? { status: 'free', source: 'free' } : null,
    createdAt: null,
    updatedAt: null,
  }
}

export function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}
