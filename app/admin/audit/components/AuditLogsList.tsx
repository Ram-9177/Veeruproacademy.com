'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/app/components/Badge'
import { Shield, User, FileText, Trash2, Edit, Plus } from 'lucide-react'
import type { RoleKey } from '@/lib/types/auth'

interface AuditLog {
  id: string
  action: string
  contentType: string | null
  contentId: string | null
  details: any
  createdAt: Date
  user: {
    name: string | null
    email: string | null
    role: RoleKey
  }
}

interface AuditLogsListProps {
  logs: AuditLog[]
}

const actionIcons: Record<string, any> = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  LOGIN: User,
  LOGOUT: User,
  PUBLISH: FileText,
  PERMISSION_CHANGE: Shield,
  ARCHIVE: FileText,
  RESTORE: FileText,
  UNPUBLISH: FileText
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-emerald-100 text-emerald-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  LOGIN: 'bg-green-100 text-green-700',
  LOGOUT: 'bg-neutral-100 text-neutral-700',
  PUBLISH: 'bg-purple-100 text-purple-700',
  PERMISSION_CHANGE: 'bg-amber-100 text-amber-700',
  ARCHIVE: 'bg-orange-100 text-orange-700',
  RESTORE: 'bg-lime-100 text-lime-700',
  UNPUBLISH: 'bg-neutral-100 text-neutral-700'
}

export function AuditLogsList({ logs }: AuditLogsListProps) {
  const [filterAction, setFilterAction] = useState<string>('all')

  const filteredLogs = logs.filter(log =>
    filterAction === 'all' || log.action === filterAction
  )

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              filterAction === 'all'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All
          </button>
          {uniqueActions.map((action) => {
            const Icon = actionIcons[action] || FileText
            return (
              <button
                key={action}
                onClick={() => setFilterAction(action)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center gap-2 ${
                  filterAction === action
                    ? actionColors[action] || 'bg-neutral-100 text-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {action}
              </button>
            )
          })}
        </div>
      </div>

      <div className="divide-y divide-neutral-200">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No audit logs found</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const Icon = actionIcons[log.action] || FileText
            return (
              <div
                key={log.id}
                className="p-6 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    actionColors[log.action] || 'bg-neutral-100 text-neutral-700'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-neutral-900">
                            {log.user.name || log.user.email}
                          </span>
                          <Badge tone="neutral" className="text-xs">
                            {log.user.role.replace('_', ' ')}
                          </Badge>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            actionColors[log.action] || 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {log.action}
                          </span>
                        </div>
                        {log.contentType && (
                          <p className="text-sm text-neutral-600">
                            {log.contentType.toLowerCase()}
                            {log.contentId && ` • ID: ${log.contentId.slice(0, 8)}...`}
                          </p>
                        )}
                        {log.details && typeof log.details === 'object' && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 mt-2">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

