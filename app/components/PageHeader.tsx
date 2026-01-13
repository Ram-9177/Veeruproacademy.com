import { ReactNode } from 'react'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function PageHeader({ eyebrow, title, description, actions, align = 'left', className }: Props) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-center md:justify-between', className)}>
      <div className={cn('space-y-3', align === 'center' && 'md:text-center')}>
        {eyebrow && <Badge tone="neutral">{eyebrow}</Badge>}
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-foreground">{title}</h1>
          {description && <p className="max-w-3xl text-lg text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}
