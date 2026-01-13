import React from 'react'
import { cn } from '@/lib/utils'

type PatternVariant = 'blobGrid' | 'geometric' | 'arc' | 'dots'

interface PatternSectionProps {
  variant?: PatternVariant
  className?: string
  children: React.ReactNode
}

const variantConfig: Record<PatternVariant, { baseBg: string; overlay: React.ReactNode }> = {
  blobGrid: {
    baseBg: 'bg-gradient-to-br from-cream-50 via-white to-primary-50/30',
    overlay: (
      <>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-primary-200/25 to-primary-100/15 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-teal-200/20 to-teal-100/10 blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-coral-200/15 to-coral-100/10 blur-lg" />
        
        {/* Geometric shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-sunny-200/20 rotate-45 rounded-lg" />
        <div className="absolute bottom-24 right-24 w-20 h-20 bg-brand-200/15 -rotate-12 rounded-xl" />
        
        {/* Decorative rings */}
        <div className="absolute top-1/4 right-1/3 w-32 h-32 border-2 border-primary-200/20 rounded-full" />
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(240, 143, 104, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </>
    ),
  },
  geometric: {
    baseBg: 'bg-gradient-to-br from-white via-teal-50/20 to-sky-50/30',
    overlay: (
      <>
        {/* Large shapes */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-teal-200/20 to-teal-100/15 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-tr from-sky-200/20 to-sky-100/10 blur-xl" />
        
        {/* Medium geometric elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-brand-200/15 to-brand-100/10 rotate-45 rounded-2xl blur-sm" />
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-primary-200/15 to-primary-100/10 -rotate-12 rounded-xl blur-sm" />
        
        {/* Decorative rings */}
        <div className="absolute top-1/3 left-1/4 w-40 h-40 border-3 border-teal-200/20 rounded-full" />
        <div className="absolute bottom-1/4 right-1/3 w-36 h-36 border-2 border-sky-200/15 rounded-full" />
        
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(62, 173, 150, 0.1) 0px, rgba(62, 173, 150, 0.1) 1px, transparent 1px, transparent 12px)',
        }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
      </>
    ),
  },
  arc: {
    baseBg: 'bg-gradient-to-br from-primary-50/40 via-white to-warm-50/30',
    overlay: (
      <>
        {/* Large decorative circles */}
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-gradient-to-br from-sunny-200/25 to-sunny-100/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-primary-200/20 to-primary-100/10 blur-2xl" />
        
        {/* Medium accent shapes */}
        <div className="absolute top-1/3 left-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-coral-200/15 to-coral-100/10 blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-warm-200/15 to-warm-100/10 blur-lg" />
        
        {/* Geometric accents */}
        <div className="absolute top-16 right-20 w-24 h-24 bg-accent-200/15 rotate-45 rounded-xl" />
        <div className="absolute bottom-20 left-24 w-20 h-20 bg-teal-200/15 -rotate-12 rounded-lg" />
        
        {/* Decorative rings */}
        <div className="absolute top-1/4 right-1/3 w-44 h-44 border-2 border-primary-200/20 rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-36 h-36 border-2 border-warm-200/15 rounded-full" />
        
        {/* Concentric circles pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circles" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(240, 143, 104, 0.2)" strokeWidth="1"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(62, 173, 150, 0.15)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-primary-50/20" />
      </>
    ),
  },
  dots: {
    baseBg: 'bg-gradient-to-br from-white via-brand-50/20 to-accent-50/30',
    overlay: (
      <>
        {/* Large decorative shapes */}
        <div className="absolute -top-32 -left-32 w-88 h-88 rounded-full bg-gradient-to-br from-brand-200/25 to-brand-100/15 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 w-80 h-80 rounded-full bg-gradient-to-tr from-accent-200/20 to-accent-100/10 blur-2xl" />
        
        {/* Medium shapes */}
        <div className="absolute top-1/4 right-1/3 w-52 h-52 rounded-full bg-gradient-to-br from-primary-200/15 to-primary-100/10 blur-xl" />
        <div className="absolute bottom-1/3 left-1/4 w-44 h-44 rounded-full bg-gradient-to-br from-teal-200/15 to-teal-100/10 blur-lg" />
        
        {/* Geometric elements */}
        <div className="absolute top-24 left-16 w-20 h-20 bg-coral-200/20 rotate-45 rounded-xl" />
        <div className="absolute bottom-28 right-20 w-24 h-24 bg-sunny-200/15 -rotate-12 rounded-2xl" />
        
        {/* Decorative rings */}
        <div className="absolute top-1/3 right-1/4 w-40 h-40 border-3 border-brand-200/20 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border-2 border-accent-200/15 rounded-full" />
        
        {/* Modern dot grid */}
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(138, 143, 245, 0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px'
        }} />
        {/* Accent dots */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(240, 143, 104, 0.2) 2px, transparent 2px)',
          backgroundSize: '64px 64px',
          backgroundPosition: '16px 16px'
        }} />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/30" />
      </>
    ),
  },
}

export function PatternSection({ variant = 'blobGrid', className, children }: PatternSectionProps) {
  const config = variantConfig[variant]

  return (
    <section className={cn('relative isolate overflow-hidden', config.baseBg, className)}>
      <div className="pointer-events-none absolute inset-0">{config.overlay}</div>
      <div className="relative z-10">{children}</div>
    </section>
  )
}
