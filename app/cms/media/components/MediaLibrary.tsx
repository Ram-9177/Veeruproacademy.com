'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CmsMediaLite } from '@/lib/cms/constants'
import { toast } from 'sonner'
import { UploadDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface MediaLibraryProps {
  initialMedia: CmsMediaLite[]
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [media, setMedia] = useState(initialMedia)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<CmsMediaLite | null>(null)

  const filteredMedia = media.filter((item) =>
    search
      ? item.filename.toLowerCase().includes(search.toLowerCase()) ||
        item.originalName.toLowerCase().includes(search.toLowerCase())
      : true
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/media/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete media')
      }

      setMedia((prev) => prev.filter((m) => m.id !== id))
      setDeleteId(null)
      toast.success('Media deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete media')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No media uploaded</h3>
        <p className="text-gray-400 mb-6">Upload your first media file to get started</p>
        
        <div className="max-w-xl mx-auto">
          <UploadDropzone<OurFileRouter, 'cmsMedia'>
            endpoint="cmsMedia"
            onClientUploadComplete={async (res) => {
              if (!res || res.length === 0) return

              for (const file of res) {
                try {
                  const response = await fetch('/api/cms/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      filename: file.name,
                      originalName: file.name,
                      mimeType: file.type || 'application/octet-stream',
                      size: file.size,
                      url: file.url,
                    }),
                  })

                  if (response.ok) {
                    const { data } = await response.json()
                    setMedia((prev) => [data, ...prev])
                  }
                } catch (error) {
                  console.error('Failed to save media record:', error)
                }
              }

              toast.success('Upload complete!')
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Upload Section */}
      <div className="mb-8 bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Media</h2>
        <UploadDropzone<OurFileRouter, 'cmsMedia'>
          endpoint="cmsMedia"
          onClientUploadComplete={async (res) => {
            if (!res || res.length === 0) return

            for (const file of res) {
              try {
                const response = await fetch('/api/cms/media', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    filename: file.name,
                    originalName: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    size: file.size,
                    url: file.url,
                  }),
                })

                if (response.ok) {
                  const { data } = await response.json()
                  setMedia((prev) => [data, ...prev])
                }
              } catch (error) {
                console.error('Failed to save media record:', error)
              }
            }

            toast.success('Upload complete!')
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload failed: ${error.message}`)
          }}
        />
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group relative bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => setSelectedMedia(item)}
          >
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
              {item.mimeType.startsWith('image/') ? (
                <Image
                  src={item.url}
                  alt={item.alt || item.originalName}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : item.mimeType.startsWith('video/') ? (
                <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div className="p-2">
              <p className="text-sm truncate">{item.originalName}</p>
              <p className="text-xs text-gray-500">
                {(item.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDeleteId(item.id)
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-8 text-gray-400">No media matches your search</div>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedMedia.originalName}</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4 bg-gray-800 rounded-lg overflow-hidden">
                {selectedMedia.mimeType.startsWith('image/') ? (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.alt || selectedMedia.originalName}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  />
                ) : selectedMedia.mimeType.startsWith('video/') ? (
                  <video src={selectedMedia.url} controls className="w-full" />
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-400">Preview not available</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">URL</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={selectedMedia.url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedMedia.url)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-gray-400">Type</label>
                    <p>{selectedMedia.mimeType}</p>
                  </div>
                  <div>
                    <label className="text-gray-400">Size</label>
                    <p>{(selectedMedia.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div>
                    <label className="text-gray-400">Uploaded</label>
                    <p>{new Date(selectedMedia.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-popover text-popover-foreground rounded-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-xl font-bold mb-2">Delete Media</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this media file? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
