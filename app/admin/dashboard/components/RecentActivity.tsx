'use client'

import { Clock, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  logs: Array<{
    id: string
    action: string
    contentType: string | null
    contentId: string | null
    createdAt: Date
    user: {
      name: string | null
      email: string | null
    }
  }>
}

export function RecentActivity({ logs }: RecentActivityProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md p-8 shadow-xl shadow-primary/5 hover:border-primary/30 hover:bg-card/70 transition-all duration-300 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-8">Recent Activity</h2>
      <div className="space-y-4 flex-1">
        {logs.length === 0 ? (
          <p className="text-sm text-secondary-3 text-center py-12">No recent activity</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="group flex items-start gap-4 pb-4 border-b border-border/30 last:border-0 hover:opacity-80 transition-opacity duration-200">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-primary">{log.user.name || log.user.email}</span>
                  {' '}
                  <span className="text-secondary-3">{log.action.toLowerCase()}</span>
                  {log.contentType && (
                    <>
                      {' '}
                      <span className="text-secondary-3">{log.contentType.toLowerCase()}</span>
                    </>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-secondary-3/60" />
                  <span className="text-xs text-secondary-3">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

