'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, Link as LinkIcon, X } from 'lucide-react'
import { UploadDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { cn } from '@/lib/utils'

type UploadEndpoint = keyof OurFileRouter

interface ThumbnailInputProps {
  value: string
  onChange: (_url: string) => void
  label?: string
  required?: boolean
  className?: string
  uploadEndpoint?: UploadEndpoint
}

export function ThumbnailInput({
  value,
  onChange,
  label = 'Thumbnail',
  required = false,
  className,
  uploadEndpoint = 'cmsMedia'
}: ThumbnailInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [error, setError] = useState<string>('')

  const handleUploadComplete = async (files: Array<{ url: string; name: string; size: number; type?: string }>) => {
    const file = files?.[0]
    if (!file) return

    onChange(file.url)
    setError('')

    try {
      await fetch('/api/cms/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          originalName: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          url: file.url
        })
      })
    } catch (err) {
      console.warn('Failed to persist media record', err)
    }
  }

  const clearThumbnail = () => {
    onChange('')
    setError('')
  }

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all',
            mode === 'url'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          )}
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all',
            mode === 'upload'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          )}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setError('')
            }}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 placeholder:text-white/40"
            placeholder="https://example.com/image.jpg"
            required={required && mode === 'url'}
          />
          <p className="text-xs text-white/60">Enter an image URL hosted on a CDN or storage provider.</p>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-all border-white/20 hover:border-blue-500 bg-white/5">
          <UploadDropzone<OurFileRouter, UploadEndpoint>
            endpoint={uploadEndpoint}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(err: Error) => {
              setError(err.message)
            }}
          />
          <p className="text-xs text-white/60 mt-3">
            Uploads go directly to cloud storage; no server files are stored locally.
          </p>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-4 relative">
          <div className="relative w-full h-48 bg-white/5 rounded-xl overflow-hidden border border-white/20">
            <Image
              src={value}
              alt="Thumbnail preview"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={clearThumbnail}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}
