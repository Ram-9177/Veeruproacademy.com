import { NextResponse } from 'next/server'

import { DEFAULT_SITE_SETTINGS, getSiteSettings, toPublicSiteSettings } from '@/lib/site-settings'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json(
      { settings: toPublicSiteSettings(settings) },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    )
  } catch (error) {
    console.error('Failed to load site settings:', error)
    return NextResponse.json(
      { settings: toPublicSiteSettings(DEFAULT_SITE_SETTINGS) },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      }
    )
  }
}
