import Link from 'next/link'

import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { RoleKey } from '@prisma/client'

type AuditAction = string
type ContentType = string | null

import { AdminStateMessage } from '../components/AdminStateMessage'
import { AuditLogsList } from './components/AuditLogsList'

type AuditLogItem = {
  id: string
  action: AuditAction
  contentType: ContentType | null
  contentId: string | null
  details: unknown
  createdAt: Date
  user: {
    name: string | null
    email: string | null
    role: RoleKey
  }
}


export const dynamic = 'force-dynamic'
export default async function AuditPage() {
  await requireAdmin()

  let logs: AuditLogItem[] = []
  let databaseUnavailable = false

  try {
    const results = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            defaultRole: true
          }
        }
      }
    })

    logs = results.map((log) => {
      const contentType = (log as any).contentType ?? (log as any).entityType ?? null
      const contentId = (log as any).contentId ?? (log as any).entityId ?? null
      const details = (log as any).details ?? (log as any).changes ?? log.metadata ?? null

      return {
      id: log.id,
        action: String(log.action) as AuditAction,
        contentType,
        contentId,
        details,
      createdAt: log.createdAt,
      user: {
        name: log.user?.name ?? 'Unknown user',
        email: log.user?.email ?? 'unknown@local',
        role: log.user?.defaultRole ?? RoleKey.STUDENT
      }
      }
    })
  } catch (error) {
    databaseUnavailable = true
    console.error('[admin-audit] Failed to load audit logs', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Audit Logs</h1>
        <p className="text-neutral-600 mt-1">Complete activity history and security audit trail</p>
      </div>

      {databaseUnavailable ? (
        <AdminStateMessage
          tone="warning"
          title="Audit logs unavailable"
          description="The audit log viewer needs access to the PostgreSQL database. Once the database is reachable the most recent actions will appear here."
          actions={
            <Link href="/admin-help#infrastructure" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/80 text-foreground shadow-sm hover:bg-white">
              Review deployment checklist
            </Link>
          }
        />
      ) : (
        <AuditLogsList logs={logs} />
      )}
    </div>
  )
}

