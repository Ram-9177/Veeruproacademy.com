/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type FallbackProps = Omit<ImageProps, 'src'> & { src: string }

export function ImageWithFallback({ src, alt, className, style, ...rest }: FallbackProps) {
  const [didError, setDidError] = useState(false)

  if (didError) {
    return (
      <div className={`inline-flex items-center justify-center bg-muted rounded-md ${className ?? ''}`} style={style}>
        <Image
          src={ERROR_IMG_SRC}
          alt={alt || 'Image error'}
          width={88}
          height={88}
          unoptimized
          aria-hidden={alt ? 'true' : undefined}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setDidError(true)}
      {...rest}
    />
  )
}
