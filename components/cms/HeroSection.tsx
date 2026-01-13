/**
 * HeroSection - Reusable hero component with consistent layout
 * Two-column layout: content on left, visual/stats on right
 */

import Image from 'next/image'
import Link from 'next/link'
import type { CmsHeroSection } from '@/lib/cms/content-types'

type HeroSectionProps = {
  hero: CmsHeroSection
  className?: string
}

export function HeroSection({ hero, className = '' }: HeroSectionProps) {
  const backgroundClass = getBackgroundClass(hero.backgroundVariant)

  return (
    <section className={`${backgroundClass} ${className}`}>
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-6 text-center lg:text-left">
            {/* Badge */}
            {hero.badge && (
              <div className="inline-flex">
                <span className={`badge ${getBadgeVariantClass(hero.badge.variant)}`}>
                  {hero.badge.label}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {hero.title}
              {hero.titleHighlight && (
                <span className="text-primary"> {hero.titleHighlight}</span>
              )}
            </h1>

            {/* Subtitle */}
            {hero.subtitle && (
              <h2 className="text-xl sm:text-2xl text-muted-foreground font-medium">
                {hero.subtitle}
              </h2>
            )}

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href={hero.primaryCta.href}>
                <button className={`btn ${getButtonVariant(hero.primaryCta.variant || 'primary')}`}>
                  {hero.primaryCta.label}
                  {hero.primaryCta.icon && (
                    <span className="ml-2">{hero.primaryCta.icon}</span>
                  )}
                </button>
              </Link>
              
              {hero.secondaryCta && (
                <Link href={hero.secondaryCta.href}>
                  <button className={`btn ${getButtonVariant(hero.secondaryCta.variant || 'outline')}`}>
                    {hero.secondaryCta.label}
                    {hero.secondaryCta.icon && (
                      <span className="ml-2">{hero.secondaryCta.icon}</span>
                    )}
                  </button>
                </Link>
              )}
            </div>

            {/* Stats (optional - displayed below CTAs on mobile) */}
            {hero.stats && hero.stats.length > 0 && (
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                {hero.stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Image or Stats Card with Visual Elements */}
          <div className="relative">
            {/* Background decorative shapes */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-success/5 rounded-full blur-3xl"></div>
            
            {hero.image ? (
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-border z-10">
                <Image
                  src={hero.image.url}
                  alt={hero.image.alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : hero.stats && hero.stats.length > 0 ? (
              <div className="card p-8 space-y-6 bg-card shadow-xl border-2 border-primary/20 relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white font-bold mb-2">
                  ✓
                </div>
                {hero.stats.map((stat, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {stat.icon && (
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center text-2xl border border-primary/10">
                        {stat.icon}
                      </div>
                    )}
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper functions
function getBackgroundClass(variant?: string): string {
  switch (variant) {
    case 'hero':
      return 'gradient-bg-hero'
    case 'section':
      return 'gradient-bg-section'
    case 'soft':
      return 'gradient-bg-soft'
    default:
      return 'bg-background'
  }
}

function getBadgeVariantClass(variant?: string): string {
  switch (variant) {
    case 'success':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'error':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-blue-50 text-primary border-blue-200'
  }
}

function getButtonVariant(variant: string): string {
  switch (variant) {
    case 'primary':
      return 'btn-primary'
    case 'secondary':
      return 'btn-secondary'
    case 'outline':
      return 'btn-outline'
    case 'ghost':
      return 'bg-transparent hover:bg-muted text-foreground'
    default:
      return 'btn-primary'
  }
}
