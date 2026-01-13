import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type InputProps = ComponentProps<'input'> & {
  label?: string
  hint?: string
}

export function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-foreground">
      {label && <span>{label}</span>}
      <input
        className={cn(
          'w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
          className
        )}
        {...props}
      />
      {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  )
}
