import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="space-y-1">
      <input
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-border bg-surface/10 px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-[0_14px_30px_rgba(4,8,20,0.35)] focus:border-primary focus:ring-2 focus:ring-primary/60 focus:outline-none disabled:opacity-50 disabled:pointer-events-none backdrop-blur-md',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/50',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p role="alert" className="text-xs text-destructive-foreground">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
