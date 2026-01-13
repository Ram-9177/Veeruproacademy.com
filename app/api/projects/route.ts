import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listProjects } from '@/src/modules/projects/service'

// Mark this route as dynamic to avoid static generation bailouts when accessing request.url
export const dynamic = 'force-dynamic' as const

// GET /api/projects - Fetch all projects
export async function GET(request: Request) {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? null

    const { searchParams } = new URL(request.url)
    const priceParam = searchParams.get('price')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limitParam = searchParams.get('limit')

    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined
    const sanitizedLimit = Number.isFinite(limit) ? Math.min(Math.max(limit ?? 0, 1), 100) : undefined

    const { data, count, total, source, fallbackReason } = await listProjects(
      {
        price:
          priceParam === 'Free' || priceParam === 'Premium' || priceParam === 'All'
            ? (priceParam as 'Free' | 'Premium' | 'All')
            : undefined,
        category,
        search,
      },
      { userId, limit: sanitizedLimit }
    )

    return NextResponse.json(
      { success: true, data, count, total, source, fallbackReason },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=900',
        },
      }
    )
  } catch (error) {
    console.error('[api/projects] Failed to fetch projects', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
