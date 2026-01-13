"use client"
import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonStyles = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed relative select-none backdrop-blur-md',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#5d6cff] via-[#7d86ff] to-[#9ba6ff] text-white shadow-[0_18px_36px_rgba(77,90,255,0.35)] hover:shadow-[0_20px_40px_rgba(77,90,255,0.45)] hover:-translate-y-0.5',
        secondary:
          'bg-surface/10 border border-border text-white hover:bg-surface/15 hover:text-white shadow-[0_16px_32px_rgba(8,12,24,0.32)]',
        'secondary-1':
          'bg-gradient-to-r from-[#43c4a9] to-[#30a789] text-white shadow-[0_16px_32px_rgba(48,167,137,0.35)] hover:shadow-[0_20px_40px_rgba(48,167,137,0.45)] hover:-translate-y-0.5',
        'secondary-2':
          'bg-gradient-to-r from-[#f28f80] to-[#e068a8] text-white shadow-[0_16px_32px_rgba(226,120,168,0.35)] hover:shadow-[0_20px_40px_rgba(226,120,168,0.45)] hover:-translate-y-0.5',
        outline:
          'bg-transparent border border-border text-muted-foreground hover:text-foreground hover:bg-surface/10 shadow-[0_12px_28px_rgba(8,12,24,0.2)]',
        ghost:
          'text-foreground/70 hover:text-foreground hover:bg-card/20',
        light:
          'bg-card text-foreground hover:bg-muted',
        destructive:
          'bg-gradient-to-r from-[#f87171] to-[#ef4444] text-white shadow-[0_18px_36px_rgba(239,68,68,0.35)] hover:shadow-[0_22px_42px_rgba(239,68,68,0.45)]',
        subtle:
          'bg-card/8 text-foreground/85 hover:bg-card/12 border border-border shadow-[0_12px_24px_rgba(8,12,24,0.25)]',
        success:
          'bg-gradient-to-r from-[#22d3a2] to-[#14b68d] text-white shadow-[0_18px_36px_rgba(20,182,141,0.35)] hover:shadow-[0_22px_42px_rgba(20,182,141,0.45)]',
      },
      size: {
        xs: 'h-8 rounded-xl px-3 text-xs',
        sm: 'h-9 rounded-xl px-4 text-sm',
        md: 'h-10 rounded-2xl px-5 text-sm',
        lg: 'h-12 rounded-2xl px-6 text-base',
        xl: 'h-14 rounded-2xl px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  href?: string
  icon?: React.ReactNode
  loading?: boolean
  isLoading?: boolean
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, isLoading, href, icon, children, target, rel, type, ...restProps }, ref) => {
    const classes = cn(buttonStyles({ variant, size }), className)
    const busy = Boolean(loading || isLoading)
    const { disabled, onClick, ...rest } = restProps

    if (href && !disabled && !busy) {
      const anchorRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel
      return (
        <Link
          href={href}
          className={classes}
          target={target}
          rel={anchorRel}
          onClick={onClick as any}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          <span className="relative z-10 flex items-center gap-2">
            {busy ? (
              <span className="animate-spin h-4 w-4 rounded-full border-2 border-current border-t-transparent" aria-hidden />
            ) : (
              icon
            )}
            {children}
          </span>
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || busy}
        onClick={onClick}
        type={type ?? 'button'}
        {...rest}
      >
        <span className="relative z-10 flex items-center gap-2">
          {busy ? (
            <span className="animate-spin h-4 w-4 rounded-full border-2 border-current border-t-transparent" aria-hidden />
          ) : (
            icon
          )}
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'
