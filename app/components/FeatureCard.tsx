import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  title: string
  description: string
  accent?: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'elevated'
  legacyVariant?: 'gradient'
}

export function FeatureCard({ icon, title, description, accent, className, variant = 'default', legacyVariant }: Props) {
  const baseClasses = 'group rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer relative overflow-hidden'

  const effectiveVariant = variant === 'default' && legacyVariant === 'gradient' ? 'default' : variant
  const variants = {
    default: 'border border-border bg-card shadow-sm hover:border-primary/50',
    glass: 'glass-card',
    elevated: 'border border-border bg-card shadow hover:shadow-md hover:border-primary/50'
  }

  return (
  <div className={cn(baseClasses, variants[effectiveVariant], className, 'glitter-box magnetic-hover')}>
      {/* Enhanced corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/8 rounded-bl-3xl pointer-events-none transition-all duration-300 group-hover:bg-primary/12" />

      {/* Subtle hover background */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/15 text-primary transition-all duration-300 group-hover:scale-105 shadow-md group-hover:shadow-lg border-2 border-primary/10 group-hover:border-primary/20">
            {icon}
          </div>
          {accent}
        </div>

        <h3 className="mb-3 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary tracking-tight">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
          {description}
        </p>

        {/* Animated accent line - refined */}
        <div className="mt-6 flex items-center gap-2">
          <div className="h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-12" />
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 text-primary text-sm">→</span>
        </div>
      </div>
    </div>
  )
}
