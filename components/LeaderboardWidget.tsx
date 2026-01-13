'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  score: number
  badge?: string
}

export function LeaderboardWidget({ limit = 8 }: { limit?: number }) {
  const entries: LeaderboardEntry[] = []
  const display = entries.slice(0, limit)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm" role="region" aria-label="Leaderboard">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </h3>
        <span className="text-xs text-muted-foreground">This week</span>
      </div>

      <div className="space-y-2" role="list">
        {display.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Leaderboard data isn’t available yet. Check back once point tracking is enabled.
          </div>
        ) : (
          display.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-colors',
                entry.rank <= 3
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted'
              )}
              role="listitem"
            >
              <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                {getRankIcon(entry.rank) || (
                  <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">{entry.name}</span>
                  {entry.badge && <span className="text-lg">{entry.badge}</span>}
                </div>
                <div className="text-xs text-muted-foreground">{entry.score} points</div>
              </div>

              {entry.rank <= 3 && (
                <div className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  Top {entry.rank}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-center text-muted-foreground">
          Earn points by completing lessons and projects
        </p>
      </div>
    </div>
  )
}
