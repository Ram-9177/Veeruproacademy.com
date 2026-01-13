// Realtime event broadcasting for connected clients
// In production, consider using Redis pub/sub for multi-instance support

export const clients = new Set<ReadableStreamDefaultController>()

type BroadcastType = 'UPDATE' | 'CREATE' | 'DELETE' | 'NOTIFICATION' | 'SYNC'

interface BroadcastPayload {
  title?: string
  message?: string
  entity?: string
  entityId?: string
  [key: string]: unknown
}

export function broadcastUpdate(type: BroadcastType, data: BroadcastPayload) {
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
}

// Helper functions for common broadcast types
export function notifyContentCreated(entity: string, title: string, entityId?: string) {
  broadcastUpdate('CREATE', { 
    entity, 
    title, 
    entityId,
    message: `New ${entity} created: ${title}` 
  })
}

export function notifyContentUpdated(entity: string, title: string, entityId?: string) {
  broadcastUpdate('UPDATE', { 
    entity, 
    title, 
    entityId,
    message: `${entity} updated: ${title}` 
  })
}

export function notifyContentDeleted(entity: string, title: string, entityId?: string) {
  broadcastUpdate('DELETE', { 
    entity, 
    title, 
    entityId,
    message: `${entity} deleted: ${title}` 
  })
}

export function sendNotification(message: string, title?: string) {
  broadcastUpdate('NOTIFICATION', { message, title })
}

// Get current connection count
export function getClientCount(): number {
  return clients.size
}
