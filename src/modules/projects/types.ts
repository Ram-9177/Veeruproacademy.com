import type { Project as PrismaProject, SavedItem } from '@prisma/client'

export type ProjectUnlockStatus = 'free' | 'locked' | 'pending' | 'unlocked'

export type ProjectUnlockMetadataStatus = 'free' | 'pending' | 'approved' | 'rejected'

export interface ProjectUnlockMetadata {
  status: ProjectUnlockMetadataStatus
  submittedAt?: string
  verifiedAt?: string
  proofUrl?: string
  notes?: string
  verifierId?: string
  source?: 'free' | 'manual'
  [key: string]: unknown
}

export interface ProjectSummary {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail: string | null
  level: string | null
  category: string | null
  price: number
  tools: string[]
  includes: string[]
  featured: boolean
  status: PrismaProject['status'] | null
  driveLink: string | null
  upiId: string | null
  formUrl: string | null
  unlockStatus: ProjectUnlockStatus
  unlockMetadata?: ProjectUnlockMetadata | null
  createdAt: string | null
  updatedAt: string | null
}

export interface ProjectListFilters {
  price?: 'Free' | 'Premium' | 'All'
  category?: string | null
  search?: string | null
}

export interface ProjectListOptions {
  userId?: string | null
  limit?: number
  includeUnpublished?: boolean
}

export interface ProjectListResult {
  data: ProjectSummary[]
  count: number
  total: number
  source: 'database' | 'static'
  fallbackReason?: string
}

export interface ProjectWithUnlockContext {
  project: PrismaProject
  unlock?: SavedItem | null
}
