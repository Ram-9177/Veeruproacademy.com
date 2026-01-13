import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <div className="space-y-1">
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
        error && 'border-destructive focus:border-destructive focus:ring-destructive',
        className
      )}
      aria-invalid={!!error}
      {...props}
    />
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'
