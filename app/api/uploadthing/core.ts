import { auth } from '@/lib/auth'
import { RoleKey } from '@prisma/client'
import { isAdminOrMentor } from '@/lib/auth-utils'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UTApi } from 'uploadthing/server'

const f = createUploadthing()

const ensureAdmin = async () => {
  const session = await auth()
  const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
  if (!session || !isAdminOrMentor(roles)) {
    throw new Error('Unauthorized')
  }
  return session
}

const ensureAuthenticated = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

export const ourFileRouter = {
  projectThumbnail: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      await ensureAdmin()
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  courseThumbnail: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      await ensureAdmin()
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  lessonMedia: f({
    image: { maxFileSize: '8MB', maxFileCount: 5 },
    video: { maxFileSize: '32MB', maxFileCount: 1 },
    pdf: { maxFileSize: '16MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      await ensureAdmin()
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  cmsMedia: f({
    image: { maxFileSize: '8MB', maxFileCount: 10 },
    video: { maxFileSize: '32MB', maxFileCount: 3 },
    pdf: { maxFileSize: '16MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      await ensureAdmin()
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  projectProof: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      await ensureAuthenticated()
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),

  coursePaymentProof: f({ image: { maxFileSize: '8MB', maxFileCount: 1 } })
    .middleware(async () => {
      await ensureAuthenticated()
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

export const utApi = new UTApi()
