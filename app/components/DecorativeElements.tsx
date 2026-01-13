import React from 'react'
import { cn } from '@/lib/utils'

interface WavyDividerProps {
  position?: 'top' | 'bottom'
  color?: string
  className?: string
}

export function WavyDivider({ position = 'bottom', color = 'white', className }: WavyDividerProps) {
  const isTop = position === 'top'
  
  return (
    <div className={cn('absolute left-0 right-0 w-full overflow-hidden', isTop ? 'top-0' : 'bottom-0', className)}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn('relative block w-full', isTop ? 'rotate-180' : '')}
        style={{ height: '60px' }}
      >
        <path
          d="M0,0 C150,60 350,60 600,30 C850,0 1050,0 1200,30 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

interface ScallopedDividerProps {
  position?: 'top' | 'bottom'
  color?: string
  className?: string
}

export function ScallopedDivider({ position = 'bottom', color = 'white', className }: ScallopedDividerProps) {
  const isTop = position === 'top'
  
  return (
    <div className={cn('absolute left-0 right-0 w-full overflow-hidden', isTop ? 'top-0' : 'bottom-0', className)}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn('relative block w-full', isTop ? 'rotate-180' : '')}
        style={{ height: '50px' }}
      >
        <path
          d="M0,0 Q30,60 60,0 T120,0 T180,0 T240,0 T300,0 T360,0 T420,0 T480,0 T540,0 T600,0 T660,0 T720,0 T780,0 T840,0 T900,0 T960,0 T1020,0 T1080,0 T1140,0 T1200,0 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

interface FloatingIconProps {
  icon: React.ReactNode
  position: { top?: string; bottom?: string; left?: string; right?: string }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function FloatingIcon({ icon, position, size = 'md', className }: FloatingIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-2xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-16 h-16 text-4xl'
  }
  
  return (
    <div
      className={cn(
        'absolute flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      style={position}
    >
      {icon}
    </div>
  )
}
