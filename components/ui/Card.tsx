import * as React from 'react'
import { cn } from '@/lib/utils'

export type CardVariant = 'default' | 'glass' | 'subtle' | 'outline' | 'accent'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  variant?: CardVariant
  as?: 'div' | 'article' | 'section'
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-card/7 backdrop-blur-xl border border-border shadow-[0_18px_38px_rgba(4,8,20,0.38)]',
  glass:
    'bg-card/5 backdrop-blur-2xl border border-border shadow-[0_25px_55px_rgba(4,8,20,0.45)]',
  subtle:
    'bg-card/4 backdrop-blur-lg border border-border shadow-[0_12px_28px_rgba(4,8,20,0.28)]',
  outline:
    'bg-transparent border border-border shadow-[0_16px_35px_rgba(4,8,20,0.25)]',
  accent:
    'bg-gradient-to-br from-primary via-primary/90 to-primary/95 text-primary-foreground shadow-[0_25px_50px_rgba(72,84,255,0.45)]',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, variant = 'default', as = 'div', ...props }, ref) => {
    const Comp = as as any
    return (
      <Comp
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-300',
          variantClasses[variant],
          interactive && 'hover:shadow-xl hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
export default Card
