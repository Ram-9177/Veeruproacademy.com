/**
 * Modern Design Pattern Components
 * Inspired by tutorial page - glassmorphic, animated, gradient-based design
 */

import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Animated Background Glow - used for hero sections
 */
interface AnimatedGlowProps {
  className?: string
}

export function AnimatedGlow({ className }: AnimatedGlowProps) {
  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-1/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
    </div>
  )
}

/**
 * Glassmorphic Card - modern card with backdrop blur
 */
interface GlassmorphicCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  animated?: boolean
  pattern?: 'dots' | 'gradient' | 'none'
}

export function GlassmorphicCard({
  children,
  className,
  hover = true,
  animated = true,
  pattern = 'gradient'
}: GlassmorphicCardProps) {
  const baseClasses = cn(
    'relative rounded-3xl border border-border/30 bg-card/50 backdrop-blur-md',
    'overflow-hidden',
    hover && 'hover:bg-card/70 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500',
    animated && 'group',
    className
  )

  return (
    <div className={baseClasses}>
      {/* Pattern Background */}
      {pattern === 'gradient' && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary-1/10 to-transparent rounded-full blur-xl" />
        </div>
      )}
      
      {/* Glow Effect on Hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary-1/5 to-secondary-2/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl scale-105 pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

/**
 * Gradient Text - animated gradient text effect
 */
interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animated?: boolean
}

export function GradientText({ children, className, animated = true }: GradientTextProps) {
  return (
    <span className={cn(
      'bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground',
      animated && 'group-hover:from-primary group-hover:to-secondary-1 transition-all duration-500',
      className
    )}>
      {children}
    </span>
  )
}

/**
 * Floating Badge - animated badge with glow
 */
interface FloatingBadgeProps {
  icon?: React.ReactNode
  label: string
  className?: string
  animated?: boolean
}

export function FloatingBadge({ icon, label, className, animated = true }: FloatingBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-4 py-2 rounded-full',
      'bg-primary/10 border border-primary/20',
      'text-primary font-semibold text-sm',
      animated && 'animate-fade-in shadow-sm',
      className
    )}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

/**
 * Modern Badge - versatile badge component
 */
interface ModernBadgeProps {
  label: string
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral'
  icon?: React.ReactNode
  className?: string
  gloss?: boolean
}

export function ModernBadge({ 
  label, 
  variant = 'primary',
  icon,
  className,
  gloss = true
}: ModernBadgeProps) {
  const variantClasses = {
    primary: 'bg-primary/15 text-primary border-primary/30',
    secondary: 'bg-secondary-1/15 text-secondary-1 border-secondary-1/30',
    accent: 'bg-secondary-2/15 text-secondary-2 border-secondary-2/30',
    neutral: 'bg-secondary-3/20 text-secondary-3 border-secondary-3/30'
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1 rounded-lg',
      'border',
      gloss && 'backdrop-blur-md',
      variantClasses[variant],
      'text-xs font-semibold',
      className
    )}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

/**
 * Animated Arrow - reveals on hover
 */
export function AnimatedArrow({ className }: { className?: string }) {
  return (
    <div className={cn(
      'w-10 h-10 rounded-full',
      'bg-gradient-to-r from-primary/20 to-secondary-1/20',
      'flex items-center justify-center',
      'text-primary',
      'opacity-0 -translate-x-3 scale-75',
      'group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100',
      'transition-all duration-500 shadow-lg shadow-primary/20',
      className
    )}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

/**
 * Section Divider - elegant divider with gradient
 */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px bg-gradient-to-r from-transparent via-border to-transparent", className)} />
  )
}

/**
 * Grid Background Pattern
 */
export function GridPattern({ className }: { className?: string }) {
  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none",
      "bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)]",
      "bg-[size:40px_40px]",
      className
    )} />
  )
}

/**
 * Blob Animation - decorative animated blob
 */
interface BlobProps {
  delay?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary-1' | 'secondary-2'
  className?: string
}

export function Blob({ delay = '0s', size = 'md', color = 'primary', className }: BlobProps) {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-96 h-96',
    lg: 'w-[800px] h-[800px]'
  }

  const colorMap = {
    primary: 'bg-primary/20',
    'secondary-1': 'bg-secondary-1/20',
    'secondary-2': 'bg-secondary-2/20'
  }

  return (
    <div 
      className={cn(
        sizeMap[size],
        colorMap[color],
        'rounded-full blur-3xl animate-pulse-slow',
        className
      )}
      style={{ animationDelay: delay }}
    />
  )
}

/**
 * Search Input - modern search with animations
 */
interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  className?: string
}

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  icon,
  className
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full group", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary-1/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl" />
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-3 group-focus-within:text-primary transition-all duration-300 z-10">
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "relative w-full",
          icon ? "pl-12" : "pl-4",
          "pr-4 py-3 rounded-xl",
          "bg-background/60 border border-border/50",
          "focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-background/80",
          "outline-none transition-all duration-300",
          "placeholder:text-secondary-3/70 text-foreground font-medium"
        )}
      />
    </div>
  )
}

/**
 * Control Panel - modern control panel with background pattern
 */
interface ControlPanelProps {
  children: React.ReactNode
  className?: string
}

export function ControlPanel({ children, className }: ControlPanelProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-br from-card/40 via-card/30 to-transparent",
      "backdrop-blur-xl p-6 rounded-3xl border border-border/30 shadow-xl shadow-primary/5",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-secondary-1/20 to-transparent rounded-full blur-xl" />
      </div>
      
      <div className="relative">
        {children}
      </div>
    </div>
  )
}
