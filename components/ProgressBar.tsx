'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  label?: string
  showValue?: boolean
  animated?: boolean
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  'aria-label'?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  animated = true,
  color = 'emerald',
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value)
  const [isVisible, setIsVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const previousValueRef = useRef(displayValue)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = barRef.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [isVisible])

  useEffect(() => {
    previousValueRef.current = displayValue
  }, [displayValue])

  useEffect(() => {
    if (!isVisible || !animated) {
      setDisplayValue(value)
      previousValueRef.current = value
      return
    }

    const duration = 1500
    const startTime = Date.now()
    const startValue = previousValueRef.current
    let frameId: number

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (value - startValue) * easeOut
      
      setDisplayValue(current)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
        previousValueRef.current = value
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [isVisible, value, animated])

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const colorClasses = {
    emerald: 'bg-emerald-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
  }

  const percentage = Math.min((displayValue / max) * 100, 100)

  return (
    <div 
      ref={barRef}
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={Math.round(displayValue)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel || label || 'Progress'}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-slate-600">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-neutral-200 overflow-hidden', heightClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color],
            'shadow-sm'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

