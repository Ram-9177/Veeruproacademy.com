import { auth } from '@/lib/auth'
import { getRealtimeStats } from '@/lib/enhanced-realtime'

// GET /api/admin/realtime/stats
export async function GET() {
  const session = await auth()
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const stats = await getRealtimeStats()
    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching realtime stats:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), { status: 500 })
  }
}