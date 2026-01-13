'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Loader2 } from 'lucide-react'
import { UploadButton } from '@uploadthing/react'

interface ThumbnailUploadProps {
  onUpload: (_url: string) => void
  initialThumbnail?: string | null
}

export function ThumbnailUpload({ onUpload, initialThumbnail }: ThumbnailUploadProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialThumbnail ?? null)

  const handleUploadComplete = (res: any) => {
    if (res?.[0]?.url) {
      setThumbnailUrl(res[0].url)
      onUpload(res[0].url)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700">
        Project Thumbnail
      </label>

      {thumbnailUrl ? (
        <div className="relative group">
          <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-neutral-200">
            <Image
              src={thumbnailUrl}
              alt="Project thumbnail"
              fill
              className="object-cover"
              sizes="100%"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setThumbnailUrl(null)
              onUpload('')
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs text-neutral-500 mt-2">Click the X to remove and upload a different image</p>
        </div>
      ) : (
        // @ts-ignore - UploadButton generic typing
        <UploadButton
          endpoint="projectThumbnail"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            alert(`Upload error: ${error.message}`)
          }}
          appearance={{
            button: 'w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-emerald-500 transition-colors',
            container: 'w-full',
            allowedContent: 'hidden',
          }}
          content={{
            button({ ready }: { ready: boolean }) {
              if (ready) return <div>Click to upload thumbnail</div>
              return <Loader2 className="h-4 w-4 animate-spin" />
            },
            allowedContent() {
              return null
            },
          }}
        />
      )}
    </div>
  )
}
