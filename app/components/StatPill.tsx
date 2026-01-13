import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type StatPillProps = ComponentProps<'div'> & {
  value: string
  label: string
}

export function StatPill({ value, label, className, ...props }: StatPillProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm',
        className
      )}
      {...props}
    >
      <div className="font-display text-xl font-semibold text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  )
}
