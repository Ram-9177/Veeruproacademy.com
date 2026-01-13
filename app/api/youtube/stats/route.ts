import { NextRequest, NextResponse } from 'next/server'

// Rate limiting - simple in-memory cache
const requestCache = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 10 // 10 requests per minute per IP

function getRateLimitKey(ip: string): string {
  return `youtube-stats:${ip}`
}

function checkRateLimit(ip: string): boolean {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const cached = requestCache.get(key)

  if (!cached || now > cached.resetTime) {
    // Reset or create new entry
    requestCache.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (cached.count >= RATE_LIMIT_MAX) {
    return false
  }

  cached.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    // Get API key from environment (server-side only)
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      console.error('❌ YOUTUBE_API_KEY not configured in environment')
      return NextResponse.json(
        { error: 'YouTube API not configured' },
        { status: 500 }
      )
    }

    // Get video ID from query parameters
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')

    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json(
        { error: 'videoId parameter is required' },
        { status: 400 }
      )
    }

    // Validate videoId format (basic validation)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json(
        { error: 'Invalid videoId format' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // Fetch from YouTube API
    const youtubeUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    youtubeUrl.searchParams.append('part', 'statistics')
    youtubeUrl.searchParams.append('id', videoId)
    youtubeUrl.searchParams.append('key', apiKey)

    const response = await fetch(youtubeUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      // Cache for 5 minutes to reduce API quota usage
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      console.error(`❌ YouTube API error: ${response.status}`)
      return NextResponse.json(
        { error: 'Failed to fetch video statistics' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract statistics
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { 
          viewCount: '0',
          likeCount: '0',
          commentCount: '0'
        },
        { status: 200 }
      )
    }

    const stats = data.items[0].statistics || {}

    // Return only the statistics we need (security: don't expose raw API response)
    return NextResponse.json({
      viewCount: stats.viewCount || '0',
      likeCount: stats.likeCount || '0',
      commentCount: stats.commentCount || '0'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })

  } catch (error) {
    console.error('❌ YouTube API route error:', error)
    
    // Don't expose internal errors to client
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const preferredRegion = ['auto']
export const dynamic = 'force-dynamic'
