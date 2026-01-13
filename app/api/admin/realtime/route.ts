import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Server-Sent Events for real-time updates
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

      // Keep connection alive with heartbeat
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch (error) {
          clearInterval(interval)
        }
      }, 30000) // Every 30 seconds

      // Cleanup on close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
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



