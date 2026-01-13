'use client'

import { HeroVisuals } from './HeroVisuals'
import { Container } from './Container'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHero({ eyebrow, title, description, children, className }: PageHeroProps) {
  return (
    <div className={cn("relative overflow-hidden bg-background border-b border-border/50", className)}>
      <HeroVisuals />
      <Container className="relative z-10 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold text-sm mb-6 animate-fade-in shadow-sm">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in tracking-tight" style={{ animationDelay: '100ms' }}>
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {description}
            </p>
          )}
          {children && (
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              {children}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
