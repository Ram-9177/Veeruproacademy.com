import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'
import { Container } from './Container'
import { sectionThemes } from './sectionThemes'

type SectionProps = ComponentProps<'section'> & {
  bleed?: boolean
  variant?: 'default' | 'accent' | 'glass' | 'minimal' | 'subtle' | 'colored' | 'pattern-1' | 'pattern-2' | 'pattern-3' | 'pattern-4' | 'pattern-5' | 'mesh' | 'circuit' | 'wave' | 'organic' | 'crystalline'
  pattern?: boolean
  overlay?: boolean
}

export function Section({
  className,
  children,
  bleed,
  variant = 'default',
  pattern = false,
  overlay = false,
  ...props
}: SectionProps) {
  const variantClass = sectionThemes[variant] || sectionThemes.default

  return (
    <section 
      className={cn(
        'relative py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 overflow-hidden transition-all duration-500',
        variantClass,
        className
      )} 
      {...props}
    >
      {/* Enhanced decorative elements with better positioning */}
      {variant === 'default' && (
        <>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary-1/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary-2/6 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
        </>
      )}

      {/* Pattern overlay for default sections */}
      {pattern && variant === 'default' && (
        <div className="absolute inset-0 dots-pattern opacity-60" />
      )}

      {/* Enhanced pattern overlays */}
      {(variant === 'pattern-1' || variant === 'pattern-2' || variant === 'pattern-3') && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-white/10" />
          {/* Animated accent lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-primary/15 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 right-1/3 w-px h-full bg-secondary-1/15 animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute left-0 top-1/3 w-full h-px bg-secondary-2/10 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {/* Special effects for mesh and circuit patterns */}
      {variant === 'mesh' && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Enhanced mesh overlay */}
          <div className="absolute inset-0 bg-white/10" />
          
          {/* Organic mesh nodes - various sizes */}
          <div className="absolute top-1/5 left-1/6 w-3 h-3 bg-primary/25 rounded-full blur-sm" />
          <div className="absolute top-2/5 right-1/5 w-2 h-2 bg-secondary-1/25 rounded-full" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-secondary-2/25 rounded-full" />
          <div className="absolute top-3/5 left-3/4 w-2.5 h-2.5 bg-primary/20 rounded-full blur-sm" />
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-secondary-1/20 rounded-full" />
          <div className="absolute top-4/5 left-2/5 w-2 h-2 bg-secondary-2/20 rounded-full" />
          
          {/* Connecting mesh lines */}
          <div className="absolute top-1/5 left-1/6 w-16 h-px bg-primary/8 transform rotate-45 origin-left" />
          <div className="absolute top-2/5 right-1/5 w-12 h-px bg-secondary-1/8 transform -rotate-30 origin-right" />
          <div className="absolute bottom-1/4 left-1/3 w-20 h-px bg-secondary-2/6 transform rotate-12 origin-left" />
          
          {/* Subtle mesh texture overlay */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 70% 60%, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 40% 80%, rgba(244, 162, 97, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 80px 80px, 70px 70px'
          }} />
        </div>
      )}

      {variant === 'circuit' && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Circuit overlay */}
          <div className="absolute inset-0 bg-white/8" />
          
          {/* Enhanced circuit lines - horizontal */}
          <div className="absolute left-0 top-1/4 w-1/3 h-px bg-primary/15" />
          <div className="absolute right-0 top-1/4 w-1/4 h-px bg-primary/15" />
          <div className="absolute left-1/4 top-2/3 w-1/2 h-px bg-secondary-1/12" />
          <div className="absolute right-1/5 top-3/4 w-1/3 h-px bg-secondary-2/10" />
          
          {/* Enhanced circuit lines - vertical */}
          <div className="absolute top-0 left-1/6 w-px h-1/3 bg-primary/15" />
          <div className="absolute bottom-0 right-1/5 w-px h-1/4 bg-secondary-1/12" />
          <div className="absolute top-1/3 left-3/4 w-px h-1/3 bg-secondary-2/10" />
          <div className="absolute bottom-1/4 left-1/2 w-px h-1/5 bg-primary/8" />
          
          {/* Circuit connection nodes */}
          <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-primary/25 rounded-full" />
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-secondary-1/25 rounded-full" />
          <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-secondary-2/20 rounded-full" />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-primary/20 rounded-full" />
          
          {/* Corner junction boxes */}
          <div className="absolute top-4 left-4 w-2 h-2 border border-primary/20 bg-primary/5" />
          <div className="absolute top-4 right-4 w-2 h-2 border border-secondary-1/20 bg-secondary-1/5" />
          <div className="absolute bottom-4 left-4 w-2 h-2 border border-secondary-2/20 bg-secondary-2/5" />
          <div className="absolute bottom-4 right-4 w-2 h-2 border border-primary/15 bg-primary/5" />
        </div>
      )}

      {/* Subtle Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-white/15 pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        <Container className={cn(bleed ? 'max-w-none' : '')}>{children}</Container>
      </div>
    </section>
  )
}