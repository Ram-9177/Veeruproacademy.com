import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-primary/20 border-t-primary',
        sizeClasses[size]
      )} />
      {text && (
        <p className="text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl border-2 border-border/50 p-6 space-y-4">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded" />
          <div className="h-3 bg-muted rounded w-5/6" />
        </div>
      </div>
    </div>
  )
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  // Render up to 6 loading cards - use hidden to avoid hydration mismatch
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className={count >= 1 ? '' : 'hidden'}><LoadingCard /></div>
      <div className={count >= 2 ? '' : 'hidden'}><LoadingCard /></div>
      <div className={count >= 3 ? '' : 'hidden'}><LoadingCard /></div>
      <div className={count >= 4 ? '' : 'hidden'}><LoadingCard /></div>
      <div className={count >= 5 ? '' : 'hidden'}><LoadingCard /></div>
      <div className={count >= 6 ? '' : 'hidden'}><LoadingCard /></div>
    </div>
  )
}