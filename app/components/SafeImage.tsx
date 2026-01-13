"use client"

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type SafeImageProps = Omit<ImageProps, 'placeholder'> & {
  fallbackText?: string
  containerClassName?: string
  fallbackSrc?: string
  aspect?: string // e.g. '16/9', '1/1'
  blurDataURL?: string // custom tiny placeholder
  lazy?: boolean
}

export function SafeImage({
  alt,
  className,
  fallbackText = 'Image unavailable',
  containerClassName,
  fallbackSrc = '/icons/image-fallback.svg',
  onError,
  src,
  aspect,
  blurDataURL,
  lazy = true,
  ...rest
}: SafeImageProps) {
  const [errored, setErrored] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [displayedSrc, setDisplayedSrc] = useState(src)

  if (errored) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-lightGray-50 border border-lightGray-200 rounded-lg', containerClassName)}>
        <div className="flex flex-col items-center gap-3 text-slate-500 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emeraldGreen-100">
            <ImageIcon className="h-6 w-6 text-emeraldGreen-600" aria-hidden="true" />
          </div>
          <span className="sr-only">{alt}</span>
          <span className="text-xs font-medium text-center">{fallbackText}</span>
        </div>
      </div>
    )
  }

  const wrapperStyle = aspect ? { aspectRatio: aspect } : {}
  
  // Extract priority from rest to determine loading behavior
  const hasPriority = (rest as any).priority === true
  
  // Determine loading attribute: if priority is set, don't use loading attr
  // If lazy is true and no priority, use 'lazy', otherwise undefined
  const loadingAttr = hasPriority ? undefined : (lazy ? 'lazy' : undefined)

  return (
    <div className={cn('relative h-full w-full overflow-hidden rounded-lg', containerClassName)} style={wrapperStyle}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-lightGray-100" aria-hidden="true" />
      )}
      <Image
        alt={alt}
        className={cn(className, !loaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500')}
        src={displayedSrc}
        loading={loadingAttr}
        decoding="async"
        placeholder={blurDataURL ? 'blur' : undefined}
        blurDataURL={blurDataURL}
        onError={(e) => {
          // Try fallback once before giving up
          if (fallbackSrc && displayedSrc !== fallbackSrc) {
            setDisplayedSrc(fallbackSrc)
            return
          }
          setErrored(true)
          onError?.(e)
        }}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </div>
  )
}
