import { cn } from '@/lib/utils'
import { ComponentProps, ReactNode } from 'react'

type CardProps = Omit<ComponentProps<'div'>, 'title'> & {
  as?: 'div' | 'section' | 'article'
  title?: string | ReactNode
  description?: string | ReactNode
  variant?: 'default' | 'elevated' | 'glass' | 'minimal'
  accent?: 'top' | 'left' | 'none'
  accentColor?: 'primary' | 'secondary-1' | 'secondary-2' | 'secondary-3'
  interactive?: boolean
}

export function Card({ 
  as = 'div', 
  className, 
  children, 
  title, 
  description, 
  variant = 'default',
  accent = 'none',
  accentColor = 'primary',
  interactive = false,
  ...props 
}: CardProps) {
  const Component = as

  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white border border-slate-200 shadow-md hover:shadow-lg',
    glass: 'glass-card',
    minimal: 'bg-white/85 shadow-lg backdrop-blur-xl hover:shadow-xl'
  }

  const accentClasses = {
    none: '',
    top: `relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:rounded-t-xl ${
      accentColor === 'primary' ? 'before:bg-primary' :
      accentColor === 'secondary-1' ? 'before:bg-secondary-1' :
      accentColor === 'secondary-2' ? 'before:bg-secondary-2' :
      'before:bg-secondary-3'
    }`,
    left: `relative before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:rounded-l-xl ${
      accentColor === 'primary' ? 'before:bg-primary' :
      accentColor === 'secondary-1' ? 'before:bg-secondary-1' :
      accentColor === 'secondary-2' ? 'before:bg-secondary-2' :
      'before:bg-secondary-3'
    }`
  }

  const interactiveClasses = interactive 
    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group' 
    : 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5'

  return (
    <Component
      className={cn(
        'rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 relative overflow-hidden',
        variantClasses[variant],
        accentClasses[accent],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {/* Subtle corner accent - refined */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/6 rounded-bl-2xl pointer-events-none" />

      {/* Subtle background pattern for glass variant */}
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {(title || description) && (
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col gap-2 sm:gap-3">
            {typeof title === 'string' ? (
              <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">{title}</h3>
            ) : title}
            {typeof description === 'string' ? (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-200">{description}</p>
            ) : description}
          </div>
        )}
        {children}
      </div>
    </Component>
  )
}
