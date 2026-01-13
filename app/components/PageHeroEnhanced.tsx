'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight, Sparkles, PlayCircle, BadgeCheck, ShieldCheck, Rocket } from 'lucide-react'

interface PageHeroEnhancedProps {
  eyebrow?: string
  title: string
  titleHighlight?: string
  description?: string
  gradient?: 'blue' | 'pink' | 'mint' | 'blueMint' | 'warmOrange' | 'teal' | 'purple' | 'neutral' | 'indigo'
  cta?: { text: string; href: string }
  secondaryCta?: { text: string; href: string }
  stats?: Array<{ value: string; label: string }>
  children?: React.ReactNode
  className?: string
  imagePosition?: 'right' | 'left'
  showDecorativeElements?: boolean
  align?: 'left' | 'center'
  size?: 'default' | 'large'
}

const gradientConfig = {
  blue: {
    from: 'from-brand-600',
    to: 'to-sky-500',
    light: 'bg-sky-50',
    lightBorder: 'border-sky-200',
    accent: 'text-brand-700',
    accentBg: 'bg-brand-50',
  },
  pink: {
    from: 'from-accent-600',
    to: 'to-rose-400',
    light: 'bg-rose-50',
    lightBorder: 'border-rose-200',
    accent: 'text-accent-700',
    accentBg: 'bg-accent-50',
  },
  mint: {
    from: 'from-teal-500',
    to: 'to-emerald-400',
    light: 'bg-emerald-50',
    lightBorder: 'border-emerald-200',
    accent: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
  },
  blueMint: {
    from: 'from-primary-500',
    to: 'to-teal-400',
    light: 'bg-primary-50',
    lightBorder: 'border-primary-200',
    accent: 'text-primary-700',
    accentBg: 'bg-primary-50',
  },
  warmOrange: {
    from: 'from-primary-500',
    to: 'to-sunny-400',
    light: 'bg-sunny-50',
    lightBorder: 'border-sunny-200',
    accent: 'text-primary-700',
    accentBg: 'bg-primary-50',
  },
  teal: {
    from: 'from-teal-600',
    to: 'to-sky-500',
    light: 'bg-teal-50',
    lightBorder: 'border-teal-200',
    accent: 'text-teal-700',
    accentBg: 'bg-teal-50',
  },
  purple: {
    from: 'from-brand-700',
    to: 'to-indigo-500',
    light: 'bg-brand-50',
    lightBorder: 'border-brand-200',
    accent: 'text-brand-700',
    accentBg: 'bg-brand-50',
  },
  neutral: {
    from: 'from-navy-800',
    to: 'to-slate-500',
    light: 'bg-slate-50',
    lightBorder: 'border-slate-200',
    accent: 'text-navy-800',
    accentBg: 'bg-slate-100',
  },
  indigo: {
    from: 'from-indigo-600',
    to: 'to-blue-500',
    light: 'bg-indigo-50',
    lightBorder: 'border-indigo-200',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-50',
  },
}

export function PageHeroEnhanced({
  eyebrow,
  title,
  titleHighlight,
  description,
  gradient = 'blueMint',
  cta,
  secondaryCta,
  stats,
  children,
  className,
  imagePosition = 'right',
  showDecorativeElements = true,
  align = 'left',
  size = 'default',
}: PageHeroEnhancedProps) {
  const colors = gradientConfig[gradient]
  const isCentered = align === 'center'
  const isLarge = size === 'large'
  const statIcons = [Sparkles, ShieldCheck, Rocket]

  return (
  <section className={cn('relative isolate overflow-hidden bg-background', className)}>
      {/* Decorative Background Elements */}
      {showDecorativeElements && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-sunny-200/25 to-sunny-100/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-brand-200/20 to-brand-100/10 blur-2xl" />

          {/* Medium accent shapes */}
          <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-primary-200/20 to-primary-100/10 blur-xl" />
          <div className="absolute bottom-1/3 left-1/3 w-40 h-40 rounded-full bg-gradient-to-br from-teal-200/15 to-teal-100/10 blur-lg" />

          {/* Small geometric accents */}
          <div className="absolute top-16 right-16 w-20 h-20 bg-coral-200/20 rotate-45 rounded-lg" />
          <div className="absolute bottom-24 right-1/3 w-16 h-16 bg-accent-200/15 rotate-12 rounded-xl" />

          {/* Decorative rings */}
          <div className="absolute top-1/3 left-20 w-32 h-32 border-2 border-primary-200/25 rounded-full" />
          <div className="absolute bottom-1/4 right-24 w-28 h-28 border-2 border-teal-200/20 rounded-full" />
        </div>
      )}
      
      {/* Elegant diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(62, 173, 150, 0.08) 0px, rgba(62, 173, 150, 0.08) 1px, transparent 1px, transparent 16px)',
      }} />
      {/* Soft vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-primary-50/20 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
        <div className={cn(
          'grid items-center gap-10 lg:gap-16 xl:gap-20',
          imagePosition === 'left' ? 'lg:grid-cols-[1.05fr,0.95fr]' : 'lg:grid-cols-[1fr,1fr]'
        )}>
          <div className={cn('space-y-8', imagePosition === 'left' && 'lg:order-2', isCentered && 'text-center')}>
            {eyebrow && (
              <span className={cn(
                'inline-flex items-center gap-2 rounded-full bg-surface/10 px-4 py-2 text-sm font-semibold text-foreground shadow-sm border border-border',
                isCentered && 'justify-center'
              )}>
                <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', colors.accentBg, colors.accent)}>
                  ☆
                </span>
                {eyebrow}
              </span>
            )}

            <div className="space-y-5">
              <h1
                className={cn(
                  'font-black tracking-tight text-foreground leading-[1.05]',
                  isLarge ? 'text-4xl sm:text-5xl lg:text-6xl xl:text-[64px]' : 'text-4xl sm:text-[42px] lg:text-[52px]'
                )}
              >
                {titleHighlight ? (
                  <>
                    <span className="text-foreground">
                      {title.split(titleHighlight)[0]}
                    </span>
                    <span className={cn('text-transparent bg-clip-text bg-gradient-to-r', colors.from, colors.to)}>
                      {titleHighlight}
                    </span>
                    <span className="text-foreground">
                      {title.split(titleHighlight)[1]}
                    </span>
                  </>
                ) : (
                  title
                )}
              </h1>
              {description && (
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {(cta || secondaryCta) && (
              <div className={cn('flex flex-wrap gap-4', isCentered ? 'justify-center' : 'justify-start')}>
                {cta && (
                  <a
                    href={cta.href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-white shadow-md transition-transform duration-200',
                      'hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60',
                      `bg-gradient-to-r ${colors.from} ${colors.to}`
                    )}
                  >
                    {cta.text}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}
                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-foreground border-2 border-border bg-card shadow-sm hover:border-primary/40 hover:text-primary-700 transition-all duration-200"
                  >
                    <PlayCircle className="w-5 h-5" />
                    {secondaryCta.text}
                  </a>
                )}
              </div>
            )}

            {stats && stats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                {stats.map((stat, idx) => {
                  const Icon = statIcons[idx % statIcons.length]
                  return (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn('inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide', colors.accent)}>
                          <Icon className="h-4 w-4" />
                          Stat
                        </span>
                        <span className={cn('h-2 w-2 rounded-full', colors.accentBg)} />
                      </div>
                      <div className={cn('text-3xl font-black', colors.accent)}>{stat.value}</div>
                      <p className="text-sm text-muted-foreground font-semibold mt-1">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className={cn('relative', imagePosition === 'left' && 'lg:order-1')}>
            <div className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_18px_60px_-40px_rgba(15,23,42,0.3)] p-7 md:p-9">
              <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_25%_20%,rgba(240,143,104,0.12),transparent_35%),radial-gradient(circle_at_80%_35%,rgba(138,143,245,0.12),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(62,173,150,0.12),transparent_35%)]" />
              <div className="relative space-y-6">
                {children ? (
                  <div className="flex flex-wrap gap-3">{children}</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 rounded-2xl bg-surface/10 border border-border px-4 py-3 shadow-sm">
                      <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm', `bg-gradient-to-br ${colors.from} ${colors.to}`)}>
                        <BadgeCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Trusted team</p>
                        <p className="text-sm font-bold text-foreground">SEO + UI ready</p>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-inner p-5">
                      <div className="relative grid grid-cols-3 gap-3">
                        {[
                          { height: 'h-32', color: 'bg-brand-400', label: 'Reach' },
                          { height: 'h-40', color: 'bg-sunny-300', label: 'Quality' },
                          { height: 'h-28', color: 'bg-teal-400', label: 'Speed' },
                        ].map((bar) => (
                          <div key={bar.label} className="flex flex-col gap-3 items-center justify-end">
                            <div className={cn('w-full rounded-full bg-slate-100 py-1 text-[11px] font-semibold text-muted-foreground text-center')}>
                              {bar.label}
                            </div>
                            <div className={cn('w-full rounded-[14px]', bar.color, bar.height)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Projects', value: '+452', color: 'bg-brand-100 text-brand-800 border-brand-200' },
                        { label: 'Awards', value: '110', color: 'bg-sunny-100 text-sunny-900 border-sunny-200' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={cn(
                            'rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm border',
                            item.color
                          )}
                        >
                          <div className="text-xs uppercase text-muted-foreground">{item.label}</div>
                          <div className="text-lg font-black">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-brand-400/90 flex items-center justify-center text-white font-bold">UX</div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">Playful shapes, clean grid</p>
                        <p className="text-xs text-muted-foreground">Agency hero vibe with simple metrics.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
