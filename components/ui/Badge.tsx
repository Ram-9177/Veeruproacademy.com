import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils.ts'

const badgeStyles = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
  {
    variants: {
      variant: {
        neutral: 'bg-lightGray-100 text-slate-700 ring-lightGray-300',
        brand: 'bg-emeraldGreen-100 text-emeraldGreen-700 ring-emeraldGreen-300',
        success: 'bg-emeraldGreen-50 text-emeraldGreen-700 ring-emeraldGreen-200',
        warning: 'bg-softGold-50 text-softGold-700 ring-softGold-200',
        error: 'bg-coralRed-50 text-coralRed-700 ring-coralRed-200'
      }
    },
    defaultVariants: { variant: 'neutral' }
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeStyles> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeStyles({ variant }), className)} {...props} />
)

// This file is deprecated. Use `src/components/ui/badge.tsx` instead.

export * from "@/src/components/ui/badge.tsx";
