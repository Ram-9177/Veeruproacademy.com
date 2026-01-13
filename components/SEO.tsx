import Head from 'next/head'
import React from 'react'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  canonical?: string
  noIndex?: boolean
  jsonLd?: Record<string, any> | Record<string, any>[]
}

// Basic reusable SEO component for static export pages
// Provides sensible defaults and can be extended later (JSON-LD, etc.)
const SITE_NAME = 'Veeru\'s Pro Academy'
const DEFAULT_DESCRIPTION = 'Static-first LMS with free courses, projects and sandbox access.'
// Removed local DEFAULT_IMAGE; using external placeholder directly.

export default function SEO({
  title,
  description,
  image,
  url,
  canonical,
  noIndex,
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const desc = description || DEFAULT_DESCRIPTION
  const img = image || 'https://via.placeholder.com/1200x630.png?text=Veeru+Pro+Academy'
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
  {url && <meta property="og:url" content={url} />}
  {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={img} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: Array.isArray(jsonLd)
              ? JSON.stringify(jsonLd)
              : JSON.stringify(jsonLd),
          }}
        />
      )}
    </Head>
  )
}
