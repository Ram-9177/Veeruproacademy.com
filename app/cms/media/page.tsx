import { Suspense } from 'react'

import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { MediaLibrary } from './components/MediaLibrary'
import { LoadingSpinner } from '@/app/components/LoadingSpinner'

export const metadata = {
  title: 'Media Library | CMS',
  description: 'Manage media files',
}

async function getMedia() {
  return prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}


export const dynamic = 'force-dynamic'
export default async function CmsMediaPage() {
  await requireAdmin()
  const media = await getMedia()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-gray-400 mt-1">Upload and manage your media files</p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <MediaLibrary initialMedia={media} />
        </Suspense>
      </div>
    </div>
  )
}
