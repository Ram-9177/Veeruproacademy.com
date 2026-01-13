'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Card } from './Card'

// Feature Card with gradient background and icon
export function FeatureCard({ 
  icon: Icon,
  title,
  description,
  gradient = 'from-blue-50 to-emerald-50',
  iconColor = 'bg-blue-500',
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  gradient?: string
  iconColor?: string
  className?: string
}) {
  return (
    <div className={cn(
      'bg-gradient-to-br rounded-2xl p-6 md:p-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow',
      gradient,
      className
    )}>
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md',
        iconColor
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// Stat Card for dashboards with icon and trend
export function StatCard({ 
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue',
  className,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'emerald' | 'purple' | 'orange' | 'pink' | 'red'
  className?: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    red: 'from-red-500 to-red-600',
  }

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  }

  return (
    <Card interactive className={cn('p-5 md:p-6', className)}>
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r flex items-center justify-center rounded-xl shadow-md',
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-foreground">
            {value}
          </div>
          <div className="text-xs md:text-sm font-medium text-muted-foreground">
            {label}
          </div>
          {trend && trendValue && (
            <div className={cn('text-xs font-medium mt-1', trendColors[trend])}>
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// Course Card with thumbnail and info
export function CourseCard({
  title,
  description,
  thumbnail,
  level,
  duration,
  price,
  href,
  className,
}: {
  title: string
  description: string
  thumbnail: string
  level: string
  duration: string
  price?: number
  href: string
  className?: string
}) {
  return (
    <a href={href} className={cn('block group', className)}>
      <Card interactive className="overflow-hidden p-0 h-full">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="px-2 py-1 bg-muted rounded-md">{level}</span>
              <span>{duration}</span>
            </div>
            {price !== undefined && (
              <span className="text-lg font-bold text-foreground">
                ₹{price}
              </span>
            )}
          </div>
        </div>
      </Card>
    </a>
  )
}

// Project Card with category and difficulty
export function ProjectCard({
  title,
  description,
  thumbnail,
  category,
  difficulty,
  href,
  className,
}: {
  title: string
  description: string
  thumbnail: string
  category: string
  difficulty: string
  href: string
  className?: string
}) {
  const difficultyColors: Record<string, string> = {
    Beginner: 'bg-emerald-100 text-emerald-700',
    Intermediate: 'bg-amber-100 text-amber-700',
    Advanced: 'bg-red-100 text-red-700',
  }

  return (
    <a href={href} className={cn('block group', className)}>
      <Card interactive className="overflow-hidden p-0 h-full">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
              {category}
            </span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-md',
              difficultyColors[difficulty] || 'bg-muted text-muted-foreground'
            )}>
              {difficulty}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </Card>
    </a>
  )
}