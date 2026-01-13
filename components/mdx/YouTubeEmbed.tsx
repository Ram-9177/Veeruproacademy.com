import React from 'react'

interface Props { url?: string }

export const YouTubeEmbed: React.FC<Props> = ({ url }) => {
  if (!url) return null
  // Accept full URL or ID
  const idMatch = url.match(/([A-Za-z0-9_-]{11})$/)
  const videoId = idMatch ? idMatch[1] : url
  return (
    <div className="my-4 aspect-video w-full rounded-lg overflow-hidden shadow-soft">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default YouTubeEmbed