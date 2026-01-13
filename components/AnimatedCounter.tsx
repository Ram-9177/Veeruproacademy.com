'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: number | string
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)

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

    const element = counterRef.current
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
    if (!isVisible) return

    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0
      : value

    if (numericValue === 0) {
      setDisplayValue(0)
      return
    }

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (numericValue - startValue) * easeOut
      
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(numericValue)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, value, duration])

  const formatValue = (val: number): string => {
    if (decimals > 0) {
      return val.toFixed(decimals)
    }
    return Math.floor(val).toString()
  }

  const displayText = typeof value === 'string' && value.includes('%')
    ? value
    : `${prefix}${formatValue(displayValue)}${suffix}`

  return (
    <span ref={counterRef} className={className} aria-live="polite">
      {displayText}
    </span>
  )
}

