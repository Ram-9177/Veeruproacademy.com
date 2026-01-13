'use client'

import { Eye, CheckCircle, TrendingUp } from 'lucide-react'
import { AnimatedCounter } from '@/components/AnimatedCounter'

interface AnalyticsDashboardProps {
  pageViews: number
  lessonCompletions: number
  topContent: Array<{
    contentId: string
    _count: { id: number }
  }>
}

export function AnalyticsDashboard({ pageViews, lessonCompletions, topContent }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Page Views</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                <AnimatedCounter value={pageViews} />
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-900/20 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Lesson Completions</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                <AnimatedCounter value={lessonCompletions} />
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-900/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {pageViews > 0 ? ((lessonCompletions / pageViews) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-900/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Top Content</h2>
        <div className="space-y-3">
          {topContent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No analytics data yet</p>
          ) : (
            topContent.map((item, index) => (
              <div key={item.contentId} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-900/20 flex items-center justify-center text-sm font-semibold text-emerald-400">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Content ID: {item.contentId}</p>
                    <p className="text-xs text-muted-foreground">{item._count.id} views</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

