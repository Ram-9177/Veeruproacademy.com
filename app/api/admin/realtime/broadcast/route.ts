import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import { RoleKey } from '@prisma/client'
import {
  notifyContentCreated,
  notifyContentUpdated,
  notifyContentDeleted,
  sendNotification,
  broadcastUpdate,
} from '@/lib/realtime'
import prisma from '@/lib/db'

// POST /api/admin/realtime/broadcast
// Body: { type: 'CREATE'|'UPDATE'|'DELETE'|'NOTIFICATION'|'UPDATE_RAW', entity?, title?, entityId?, message?, data? }
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const roles = (session.user as { roles?: RoleKey[] })?.roles ?? []
  if (!isAdmin(roles)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  let body: any = {}
  try {
    body = await req.json()
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { type, entity, title, entityId, message, data } = body

  if (!type) {
    return new Response(JSON.stringify({ error: 'Missing `type` in body' }), { status: 400 })
  }

  try {
    // Persist event to database for polling history/audit
    try {
      await prisma.realtimeEvent.create({
        data: {
          channel: 'admin',
          type,
          entity: entity ?? null,
          payload: { title, message, data, entityId },
        },
      })
    } catch (dbErr) {
      console.warn('Failed to persist realtime event:', dbErr)
    }

    switch (type) {
      case 'CREATE':
        notifyContentCreated(entity ?? 'content', title ?? 'New item', entityId)
        break
      case 'UPDATE':
        notifyContentUpdated(entity ?? 'content', title ?? 'Updated item', entityId)
        break
      case 'DELETE':
        notifyContentDeleted(entity ?? 'content', title ?? 'Deleted item', entityId)
        break
      case 'NOTIFICATION':
        sendNotification(message ?? 'Notification', title ?? undefined)
        break
      case 'UPDATE_RAW':
        // Send an arbitrary payload to all clients
        broadcastUpdate('UPDATE', { ...(data ?? {}), message: message ?? undefined })
        break
      default:
        return new Response(JSON.stringify({ error: 'Unknown type' }), { status: 400 })
    }
  } catch (error) {
    console.error('Error broadcasting realtime event:', error)
    return new Response(JSON.stringify({ error: 'Broadcast failed' }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
