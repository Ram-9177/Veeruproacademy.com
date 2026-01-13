// Enhanced Realtime System with Automatic Database Change Broadcasting
// This system automatically broadcasts database changes to all connected clients

import { clients } from './realtime'
import prisma from './db'

type BroadcastType = 'UPDATE' | 'CREATE' | 'DELETE' | 'NOTIFICATION' | 'SYNC'

interface BroadcastPayload {
  title?: string
  message?: string
  entity?: string
  entityId?: string
  [key: string]: unknown
}

// Enhanced broadcast function with database persistence
export async function broadcastUpdate(type: BroadcastType, data: BroadcastPayload, persist: boolean = true) {
  const message = JSON.stringify({
    type,
    data,
    timestamp: Date.now()
  })
  const encoder = new TextEncoder()
  const encoded = encoder.encode(`data: ${message}\n\n`)

  const deadClients: ReadableStreamDefaultController[] = []

  clients.forEach((controller) => {
    try {
      controller.enqueue(encoded)
    } catch (error) {
      // Mark client for removal if write fails
      deadClients.push(controller)
    }
  })

  // Clean up dead connections
  deadClients.forEach((client) => clients.delete(client))

  // Persist to database for polling fallback and audit trail
  if (persist) {
    try {
      await prisma.realtimeEvent.create({
        data: {
          channel: 'auto',
          type,
          entity: data.entity ?? null,
          payload: data as any, // Cast to any for Prisma JSON field
        },
      })
    } catch (dbErr) {
      console.warn('Failed to persist realtime event:', dbErr)
    }
  }
}

// Database change hooks - automatically called when data changes
export async function onDatabaseChange(entity: string, operation: 'CREATE' | 'UPDATE' | 'DELETE', data: any) {
  const entityId = data.id?.toString() || data.slug?.toString()

  switch (operation) {
    case 'CREATE':
      await broadcastUpdate('CREATE', {
        entity,
        title: data.title || `${entity} created`,
        entityId,
        message: `New ${entity} created: ${data.title || entityId}`,
        data
      })
      break

    case 'UPDATE':
      await broadcastUpdate('UPDATE', {
        entity,
        title: data.title || `${entity} updated`,
        entityId,
        message: `${entity} updated: ${data.title || entityId}`,
        data
      })
      break

    case 'DELETE':
      await broadcastUpdate('DELETE', {
        entity,
        title: data.title || `${entity} deleted`,
        entityId,
        message: `${entity} deleted: ${data.title || entityId}`,
        data
      })
      break
  }
}

// Enhanced helper functions for common operations
export async function notifyContentCreated(entity: string, title: string, entityId?: string, data?: any) {
  await broadcastUpdate('CREATE', {
    entity,
    title,
    entityId,
    message: `New ${entity} created: ${title}`,
    data
  })
}

export async function notifyContentUpdated(entity: string, title: string, entityId?: string, data?: any) {
  await broadcastUpdate('UPDATE', {
    entity,
    title,
    entityId,
    message: `${entity} updated: ${title}`,
    data
  })
}

export async function notifyContentDeleted(entity: string, title: string, entityId?: string, data?: any) {
  await broadcastUpdate('DELETE', {
    entity,
    title,
    entityId,
    message: `${entity} deleted: ${title}`,
    data
  })
}

export async function sendNotification(message: string, title?: string, data?: any) {
  await broadcastUpdate('NOTIFICATION', {
    message,
    title,
    data
  })
}

// Real-time sync for specific entities
export async function syncEntity(entity: string, entityId: string, data: any) {
  await broadcastUpdate('SYNC', {
    entity,
    entityId,
    message: `${entity} synchronized`,
    data
  })
}

// Get current connection count
export function getClientCount(): number {
  return clients.size
}

// Batch broadcast for multiple changes
export async function broadcastBatch(updates: Array<{ type: BroadcastType, data: BroadcastPayload }>) {
  for (const update of updates) {
    await broadcastUpdate(update.type, update.data)
  }
}

// Real-time statistics
export interface RealtimeStats {
  connectedClients: number
  totalEvents: number
  recentEvents: number
}

export async function getRealtimeStats(): Promise<RealtimeStats> {
  const connectedClients = getClientCount()

  try {
    const totalEvents = await prisma.realtimeEvent.count()
    const recentEvents = await prisma.realtimeEvent.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })

    return {
      connectedClients,
      totalEvents,
      recentEvents
    }
  } catch (error) {
    console.warn('Failed to get realtime stats:', error)
    return {
      connectedClients,
      totalEvents: 0,
      recentEvents: 0
    }
  }
}