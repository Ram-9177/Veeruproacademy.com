import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type BadgeProps = ComponentProps<'span'> & {
  tone?: 'primary' | 'secondary-1' | 'secondary-2' | 'secondary-3' | 'neutral' | 'green' | 'gold' | 'accent'
}

export function Badge({ tone = 'primary', className, ...props }: BadgeProps) {
  // Map legacy tone names to new system
  const normalizedTone = 
    tone === 'green' ? 'secondary-1' :
    tone === 'gold' ? 'secondary-2' :
    tone === 'accent' ? 'secondary-1' :
    tone

  const toneStyles = {
    primary: 'border-transparent bg-primary/15 text-primary hover:bg-primary/25',
    'secondary-1': 'border-transparent bg-secondary-1/15 text-secondary-1 hover:bg-secondary-1/25',
    'secondary-2': 'border-transparent bg-secondary-2/15 text-secondary-2 hover:bg-secondary-2/25',
    'secondary-3': 'border-transparent bg-secondary-3/15 text-secondary-3 hover:bg-secondary-3/25',
    neutral: 'border-transparent bg-neutral-subtle text-neutral-foreground hover:bg-neutral-subtle/80',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200',
        toneStyles[normalizedTone as keyof typeof toneStyles],
        className
      )}
      {...props}
    />
  )
}
