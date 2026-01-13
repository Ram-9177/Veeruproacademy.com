/**
 * StatsCard - Reusable stats display component
 */

import { TrendingUp, TrendingDown } from 'lucide-react'
import type { CmsStatCard } from '@/lib/cms/content-types'

type StatsCardProps = {
  stat: CmsStatCard
  className?: string
}

export function StatsCard({ stat, className = '' }: StatsCardProps) {
  return (
    <div className={`card p-6 space-y-3 ${className}`}>
      {/* Icon */}
      {stat.icon && (
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
          {stat.icon}
        </div>
      )}

      {/* Value and Trend */}
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
        {stat.trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              stat.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {stat.trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {stat.trend.value}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-gray-700">{stat.label}</div>

      {/* Description */}
      {stat.description && (
        <div className="text-sm text-gray-600">{stat.description}</div>
      )}
    </div>
  )
}

type StatsGridProps = {
  stats: CmsStatCard[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ stats, columns = 4, className = '' }: StatsGridProps) {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns]

  return (
    <div className={`grid ${gridClass} gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  )
}
