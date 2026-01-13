import { requireMentorOrAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { AdminStateMessage } from '../components/AdminStateMessage'
import { MediaLibrary } from '@/app/cms/media/components/MediaLibrary'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  await requireMentorOrAdmin()

  type MediaRecord = Prisma.MediaGetPayload<{
    select: {
      id: true
      filename: true
      originalName: true
      mimeType: true
      size: true
      url: true
      createdAt: true
    }
  }>

  let media: MediaRecord[] = []
  let databaseUnavailable = false

  try {
    media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })
  } catch (error) {
    databaseUnavailable = true
    console.error('[admin-media] Failed to fetch media items', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Media Library</h1>
        <p className="text-neutral-600 mt-1">Upload and manage images and assets</p>
      </div>

      {databaseUnavailable ? (
        <AdminStateMessage
          tone="warning"
          title="Database connection required"
          description="Connect your PostgreSQL database and run the Prisma migrations to enable uploading and browsing media assets from the CMS."
          actions={
            <Link href="/admin-help" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/80 text-foreground shadow-sm hover:bg-white">
              View setup guide
            </Link>
          }
        />
      ) : (
        <MediaLibrary initialMedia={media} />
      )}
    </div>
  )
}
