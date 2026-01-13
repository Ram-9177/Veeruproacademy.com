import { NextRequest } from 'next/server'
import prisma, { hasValidDatabaseUrl } from '@/lib/db'

// GET /api/realtime/updates?since_id=123
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const sinceIdParam = url.searchParams.get('since_id')
  const limitParam = url.searchParams.get('limit')
  const limit = Math.min(Number(limitParam || '100'), 500)

  const where: any = {}
  if (sinceIdParam) {
    const sinceId = Number(sinceIdParam)
    if (!Number.isNaN(sinceId)) {
      // Prisma model uses BigInt for id, so compare using BigInt to avoid mismatched types
      where.id = { gt: BigInt(sinceId) }
    }
  }

  // If database is not configured, return a safe empty response for dev
  if (!hasValidDatabaseUrl) {
    return new Response(JSON.stringify({ events: [], latestId: null }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // optional debug response: /api/realtime/updates?debug=1
  const debug = url.searchParams.get('debug')
  if (debug === '1') {
    const debugInfo: any = {
      hasValidDatabaseUrl,
      prismaType: typeof prisma,
      realtimeEventExists: !!(prisma as any).realtimeEvent,
      findManyType: typeof (prisma as any).realtimeEvent?.findMany,
    }

    return new Response(JSON.stringify({ debug: debugInfo }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const events = await prisma.realtimeEvent.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: limit,
    })

    // Serialize BigInt + Date so JSON.stringify doesn't throw
    const serializedEvents = events.map((event) => ({
      ...event,
      id: typeof event.id === 'bigint' ? Number(event.id) : event.id,
      createdAt: event.createdAt instanceof Date ? event.createdAt.toISOString() : event.createdAt,
    }))

    const latestId = serializedEvents.length ? serializedEvents[serializedEvents.length - 1].id : null

    return new Response(JSON.stringify({ events: serializedEvents, latestId }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error fetching realtime updates:', err)
    // Return the error details in dev to help debugging
    const message = (err as any)?.message ?? String(err)
    const stack = (err as any)?.stack ?? null
    return new Response(JSON.stringify({ error: 'Failed to fetch events', message, stack }), { status: 500 })
  }
}
