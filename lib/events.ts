// Lightweight in-app event bus + optional batched analytics
// Handler param prefixed with underscore to satisfy no-unused-vars when unused in callbacks
type Handler = (_payload?: any) => void
const listeners: Record<string, Handler[]> = {}
let queue: { event: string; payload: any; ts: number }[] = []
let flushTimer: any = null

export function subscribe(event: string, handler: Handler) {
  listeners[event] = listeners[event] || []
  listeners[event].push(handler)
  return () => {
    listeners[event] = (listeners[event] || []).filter(h => h !== handler)
  }
}

export function publish(event: string, _payload?: any) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug(`[events] ${event}`, _payload)
  }
  (listeners[event] || []).forEach(h => {
    try { h(_payload) } catch (_err) { /* swallow handler error */ }
  })
  if (typeof window !== 'undefined') {
    queue.push({ event, payload: _payload, ts: Date.now() })
    scheduleFlush()
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(flushQueue, 2000)
}

async function flushQueue() {
  flushTimer = null
  if (queue.length === 0) return
  const batch = queue.splice(0, queue.length)
  try {
    await fetch('/api/analytics', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(batch)
    })
  } catch {/* ignore network errors */}
}
