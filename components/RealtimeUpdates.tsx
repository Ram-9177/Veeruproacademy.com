'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type UpdateType = 'UPDATE' | 'CREATE' | 'DELETE' | 'connected' | 'error' | 'reconnecting'

interface RealtimeUpdate {
  type: UpdateType
  data?: {
    title?: string
    message?: string
    [key: string]: unknown
  }
  timestamp: number
}

export function RealtimeUpdates() {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting')
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const [lastSeenId, setLastSeenId] = useState<number>(0)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setConnectionStatus('connecting')
    
    try {
      const eventSource = new EventSource('/api/admin/realtime/events')
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setConnectionStatus('connected')
        reconnectAttempts.current = 0
      }

      eventSource.onmessage = (event) => {
        try {
          // Handle SSE data format
          const data = event.data.startsWith('data: ') 
            ? event.data.slice(6) 
            : event.data
          
          if (data.trim() === '' || data.startsWith(':')) return // Skip heartbeats
          
          const update: RealtimeUpdate = JSON.parse(data)
          
          if (update.type === 'connected') {
            setConnectionStatus('connected')
            return
          }
          const title = (update.data?.title as string | undefined)?.toLowerCase() || ''
          const message = (update.data?.message as string | undefined)?.toLowerCase() || ''
          // Drop noisy test/demo events (e.g., Playwright seeds, test monitors)
          if (title.includes('playwright') || title.includes('test') || message.includes('test')) {
            return
          }
          
          setUpdates(prev => [update, ...prev.slice(0, 2)]) // Keep last 3 updates max
          
          // Auto-dismiss after 5 seconds
          setTimeout(() => {
            setUpdates(prev => prev.filter(u => u.timestamp !== update.timestamp))
          }, 5000)
        } catch (error) {
          console.error('Error parsing realtime update:', error)
        }
      }

      eventSource.onerror = () => {
        setConnectionStatus('error')
        eventSource.close()
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectAttempts.current++
          
          setConnectionStatus('disconnected')
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }
    } catch (error) {
      console.error('Failed to create EventSource:', error)
      setConnectionStatus('error')
    }
  }, [])

  useEffect(() => {
    connect()

    // Start polling as a fallback so admin UIs get events even if SSE isn't available
    const poll = async () => {
      try {
        const res = await fetch(`/api/realtime/updates?since_id=${lastSeenId}`)
        if (res.ok) {
          const body = await res.json()
          const events = body.events || []
          if (events.length) {
            const mapped = events.map((e: any) => ({
              type: e.type as UpdateType,
              data: e.payload ?? {},
              timestamp: new Date(e.createdAt).getTime(),
            })) as RealtimeUpdate[]

            setUpdates(prev => {
              const merged = [...mapped.reverse(), ...prev]
              // filter noisy test/demo events
              const filtered = merged.filter((u) => {
                const t = (u.data?.title as string | undefined)?.toLowerCase() || ''
                const message = (u.data?.message as string | undefined)?.toLowerCase() || ''
                return !(
                  t.includes('playwright') ||
                  message.includes('playwright') ||
                  t.includes('test') ||
                  message.includes('test')
                )
              })
              return filtered.slice(0, 3)
            })

            const latest = events[events.length - 1].id
            if (latest) setLastSeenId(Number(latest))
          }
        }
      } catch (err) {
        // polling failures are non-fatal; keep SSE attempts
      }
    }

    pollingRef.current = setInterval(poll, 3000)

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [connect, lastSeenId])

  const dismissUpdate = (timestamp: number) => {
    setUpdates(prev => prev.filter(u => u.timestamp !== timestamp))
  }

  const getUpdateIcon = (type: UpdateType) => {
    switch (type) {
      case 'UPDATE':
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />
      case 'CREATE':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'DELETE':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
    }
  }

  const getUpdateStyles = (type: UpdateType) => {
    switch (type) {
      case 'UPDATE':
        return 'border-blue-200 bg-blue-50'
      case 'CREATE':
        return 'border-emerald-200 bg-emerald-50'
      case 'DELETE':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getUpdateMessage = (update: RealtimeUpdate) => {
    if (update.data?.message) return update.data.message
    switch (update.type) {
      case 'UPDATE':
        return 'Content updated'
      case 'CREATE':
        return 'New content created'
      case 'DELETE':
        return 'Content deleted'
      default:
        return 'Update received'
    }
  }

  if (updates.length === 0 && connectionStatus === 'connected') return null

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-2 max-w-sm">
      {/* Connection status indicator */}
      {connectionStatus !== 'connected' && (
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border bg-white',
          connectionStatus === 'error' && 'border-red-200 bg-red-50',
          connectionStatus === 'connecting' && 'border-yellow-200 bg-yellow-50',
          connectionStatus === 'disconnected' && 'border-gray-200 bg-gray-50'
        )}>
          {connectionStatus === 'connecting' && (
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
          )}
          {connectionStatus === 'error' && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          {connectionStatus === 'disconnected' && (
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          )}
          <p className="text-sm font-medium text-neutral-900">
            {connectionStatus === 'connecting' && 'Connecting to realtime updates...'}
            {connectionStatus === 'error' && 'Connection lost'}
            {connectionStatus === 'disconnected' && 'Reconnecting...'}
          </p>
        </div>
      )}

      {/* Update notifications */}
      {updates.map((update) => (
        <div
          key={update.timestamp}
          className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border bg-white animate-in slide-in-from-left duration-300',
            getUpdateStyles(update.type)
          )}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getUpdateIcon(update.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900">
              {getUpdateMessage(update)}
            </p>
            {update.data?.title && (
              <p className="text-xs text-neutral-600 truncate mt-0.5">
                {update.data.title}
              </p>
            )}
          </div>
          <button
            onClick={() => dismissUpdate(update.timestamp)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        </div>
      ))}
    </div>
  )
}
