import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { RoleKey } from '@prisma/client'
import { clients } from '@/lib/realtime'
import { initRealtimeForwarding } from '@/lib/supabase-client'

// Broadcast events to all connected clients
// In production, use Redis pub/sub for multi-instance support

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }
  const roles = (session.user as { roles?: RoleKey[] })?.roles ?? []
  if (!isAdmin(roles)) {
    return new Response('Forbidden', { status: 403 })
  }

  // Initialize optional Supabase -> SSE forwarding. This is idempotent and
  // will no-op if Supabase isn't configured. We await it so subscriptions
  // are active for the admin session that opens the EventSource.
  try {
    await initRealtimeForwarding()
  } catch (err) {
    // Don't block SSE on forwarding errors — log and continue.
    console.error('Failed to init realtime forwarding:', err)
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)
      
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`))

      // Heartbeat to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch (error) {
          clearInterval(interval)
          clients.delete(controller)
        }
      }, 30000)

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        clients.delete(controller)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
