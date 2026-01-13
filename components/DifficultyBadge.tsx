'use client'

import { cn } from '@/lib/utils'
import { Tooltip } from './Tooltip'

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Clean difficulty colors: Beginner=Success, Intermediate=Primary, Advanced=Warning
const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    color: 'bg-success-50 text-success-700 border-success-200',
    icon: '●',
    tooltip: 'Perfect for those just starting out',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-primary-50 text-primary-700 border-primary-200',
    icon: '●●',
    tooltip: 'Some prior knowledge recommended',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-warning-50 text-warning-700 border-warning-200',
    icon: '●●●',
    tooltip: 'For experienced developers',
  },
}

export function DifficultyBadge({ 
  difficulty, 
  showIcon = true, 
  size = 'md',
  className 
}: DifficultyBadgeProps) {
  const normalized = difficulty.toLowerCase() as keyof typeof difficultyConfig
  const config = difficultyConfig[normalized] || difficultyConfig.beginner

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }

  const badge = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium border',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span aria-hidden="true" className="text-[8px]">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  )

  return (
    <Tooltip content={config.tooltip} side="top">
      {badge}
    </Tooltip>
  )
}
