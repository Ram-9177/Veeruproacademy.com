// Prisma-free CMS constants/types for client components.

export const CMS_STATUS = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const

export type CmsStatus = (typeof CMS_STATUS)[keyof typeof CMS_STATUS]

export type CmsUserLite = {
  name: string | null
  email: string | null
}

export type CmsPageLite = {
  id: string
  title: string
  slug: string
  status: CmsStatus
  isPublished?: boolean
  updatedAt: string | Date
  author: CmsUserLite | null
}

export type CmsPageVersionLite = {
  id: string
  version: number
  action: 'CREATE' | 'UPDATE' | 'PUBLISH' | 'UNPUBLISH' | string
  status: CmsStatus
  data: unknown
  createdAt: string | Date
  user?: CmsUserLite | null
}

export type CmsPageWithVersionsLite = Omit<CmsPageLite, 'author'> & {
  author?: CmsUserLite | null
  versions: CmsPageVersionLite[]
  content?: string
}

export type CmsMediaLite = {
  id: string
  filename: string
  originalName: string
  url: string
  alt?: string | null
  mimeType: string
  size: number
  createdAt: string | Date
}
