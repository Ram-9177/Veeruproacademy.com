'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center',
      className
    )}>
      <div className="w-14 h-14 md:w-16 md:h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
        <Icon className="w-7 h-7 md:w-8 md:h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      {action && <div className="w-full max-w-xs">{action}</div>}
    </div>
  )
}

// Preset Empty States
export function EmptyStateNoResults() {
  return (
    <EmptyState
      icon={require('lucide-react').Search}
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for"
    />
  )
}

export function EmptyStateNoContent({
  type = 'content',
  action,
}: {
  type?: string
  action?: React.ReactNode
}) {
  return (
    <EmptyState
      icon={require('lucide-react').FileText}
      title={`No ${type} yet`}
      description={`Get started by creating your first ${type}`}
      action={action}
    />
  )
}

export function EmptyStateComingSoon() {
  return (
    <EmptyState
      icon={require('lucide-react').Sparkles}
      title="Coming soon"
      description="We're working on something amazing. Stay tuned!"
    />
  )
}

export function EmptyStateError({ 
  title = 'Something went wrong',
  description = 'We encountered an error. Please try again later.',
  action,
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <EmptyState
      icon={require('lucide-react').AlertCircle}
      title={title}
      description={description}
      action={action}
    />
  )
}
