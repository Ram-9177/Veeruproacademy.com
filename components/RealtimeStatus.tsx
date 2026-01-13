'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Users, Activity, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RealtimeStats {
  connectedClients: number
  totalEvents: number
  recentEvents: number
}

export function RealtimeStatus() {
  const [stats, setStats] = useState<RealtimeStats | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/realtime/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('Failed to fetch realtime stats:', error)
      }
    }

    // Fetch stats immediately and then every 30 seconds
    fetchStats()
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  // Check connection status by attempting to connect to SSE
  useEffect(() => {
    let eventSource: EventSource | null = null

    const checkConnection = () => {
      try {
        eventSource = new EventSource('/api/admin/realtime/events')
        eventSource.onopen = () => setIsConnected(true)
        eventSource.onerror = () => setIsConnected(false)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="animate-pulse">
          <WifiOff className="h-4 w-4" />
        </div>
        <span>Loading realtime status...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Connection Status */}
      <div className={cn(
        "flex items-center gap-1.5",
        isConnected ? "text-green-600" : "text-red-600"
      )}>
        {isConnected ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="hidden sm:inline font-medium">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Connected Clients */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">{stats.connectedClients}</span>
        <span className="sm:hidden font-medium">{stats.connectedClients}</span>
      </div>

      {/* Recent Events */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Activity className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">{stats.recentEvents}</span>
        <span className="sm:hidden font-medium">{stats.recentEvents}</span>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="hidden md:inline font-medium">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  )
}

// Compact version for smaller spaces
export function RealtimeStatusCompact() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null

    const checkConnection = () => {
      try {
        eventSource = new EventSource('/api/admin/realtime/events')
        eventSource.onopen = () => setIsConnected(true)
        eventSource.onerror = () => setIsConnected(false)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  return (
    <div className={cn(
      "flex items-center gap-1 text-xs",
      isConnected ? "text-green-600" : "text-red-600"
    )}>
      {isConnected ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      <span>RT</span>
    </div>
  )
}