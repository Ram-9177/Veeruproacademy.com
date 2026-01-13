/**
 * YouTubeEmbed - Responsive YouTube video embed component
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { CmsYouTubeVideo } from '@/lib/cms/content-types'

type YouTubeEmbedProps = {
  video: CmsYouTubeVideo
  className?: string
}

export function YouTubeEmbed({ video, className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const embedUrl = `https://www.youtube.com/embed/${video.videoId}${
    video.autoplay ? '?autoplay=1' : ''
  }`

  const thumbnailUrl =
    video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

  return (
    <div className={`relative aspect-video rounded-2xl overflow-hidden bg-gray-900 ${className}`}>
      {!isLoaded ? (
        <div
          className="relative w-full h-full cursor-pointer group"
          onClick={() => setIsLoaded(true)}
        >
          {/* Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={video.title || 'Video thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary group-hover:bg-primary-dark transition-all duration-200 flex items-center justify-center transform group-hover:scale-110 shadow-xl">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Title Overlay */}
          {video.title && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold text-lg">{video.title}</h3>
            </div>
          )}
        </div>
      ) : (
        <iframe
          src={embedUrl}
          title={video.title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      )}
    </div>
  )
}

type YouTubePlaylistProps = {
  videos: CmsYouTubeVideo[]
  columns?: 1 | 2 | 3
  className?: string
}

export function YouTubePlaylist({ videos, columns = 2, className = '' }: YouTubePlaylistProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }[columns]

  return (
    <div className={`grid ${gridClass} gap-6 ${className}`}>
      {videos.map((video, index) => (
        <YouTubeEmbed key={index} video={video} />
      ))}
    </div>
  )
}
