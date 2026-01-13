'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play, Volume2, Maximize, Settings } from 'lucide-react'

interface YouTubeEmbedProps {
  videoId: string
  title?: string
  autoplay?: boolean
  showControls?: boolean
  startTime?: number
}

export function YouTubeEmbed({ 
  videoId, 
  title = 'Video Lesson',
  autoplay = false,
  showControls = true,
  startTime = 0
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [thumbnailError, setThumbnailError] = useState(false)

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: showControls ? '1' : '0',
    start: startTime.toString(),
    rel: '0',
    modestbranding: '1',
    fs: '1',
    cc_load_policy: '1',
    iv_load_policy: '3',
    autohide: '1'
  }).toString()}`

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  const handlePlay = () => {
    setIsLoaded(true)
    setIsLoaded(true)
  }

  if (!isLoaded) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700 group cursor-pointer">
        {/* Thumbnail */}
        <Image
          src={thumbnailError ? fallbackThumbnailUrl : thumbnailUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          onError={() => setThumbnailError(true)}
          priority={autoplay}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
        
        {/* Video Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <p className="text-gray-300 text-sm">Click to play video lesson</p>
        </div>
        
        {/* Duration Badge (if available) */}
        <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
          Video Lesson
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
      
      {/* Custom Controls Overlay (optional) */}
      {!showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <Play className="w-5 h-5" />
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
