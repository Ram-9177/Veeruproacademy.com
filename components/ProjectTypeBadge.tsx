'use client'

import { cn } from '@/lib/utils'
import { Tooltip } from './Tooltip'

interface ProjectTypeBadgeProps {
  type: 'web' | 'mobile' | 'api' | 'fullstack' | 'design' | string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const typeConfig = {
  web: {
    label: 'Web',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🌐',
    tooltip: 'Web application project',
  },
  mobile: {
    label: 'Mobile',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '📱',
    tooltip: 'Mobile application project',
  },
  api: {
    label: 'API',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: '🔌',
    tooltip: 'API/Backend project',
  },
  fullstack: {
    label: 'Full Stack',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: '⚡',
    tooltip: 'Full-stack application',
  },
  design: {
    label: 'Design',
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    icon: '🎨',
    tooltip: 'Design-focused project',
  },
}

export function ProjectTypeBadge({ 
  type, 
  showIcon = true, 
  size = 'md',
  className 
}: ProjectTypeBadgeProps) {
  const normalized = type.toLowerCase() as keyof typeof typeConfig
  const config = typeConfig[normalized] || {
    label: type,
    color: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    icon: '📦',
    tooltip: `${type} project`,
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }

  const badge = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold border',
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span aria-hidden="true">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  )

  return (
    <Tooltip content={config.tooltip} side="top">
      {badge}
    </Tooltip>
  )
}

