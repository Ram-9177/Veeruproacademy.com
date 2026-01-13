import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type CounterProps = {
  value: string
  label: string
  emoji?: string
  className?: string
  delay?: number
}

export function AnimatedCounter({ value, label, emoji, className, delay = 0 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState('0')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      
      // Extract number from value for animation
      const numericValue = parseInt(value.replace(/[^\d]/g, ''))
      if (numericValue && !isNaN(numericValue)) {
        let current = 0
        const increment = numericValue / 30
        const timer = setInterval(() => {
          current += increment
          if (current >= numericValue) {
            setDisplayValue(value)
            clearInterval(timer)
          } else {
            setDisplayValue(Math.floor(current).toString() + value.replace(/\d/g, '').slice(-1))
          }
        }, 50)
        
        return () => clearInterval(timer)
      } else {
        setDisplayValue(value)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <div 
      className={cn(
        'group text-center p-4 rounded-xl bg-white border border-lightGray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className
      )}
    >
      {emoji && (
        <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>
      )}
      <div className="text-2xl font-bold text-emeraldGreen-600 md:text-3xl lg:text-4xl mb-1">
        {displayValue}
      </div>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </div>
    </div>
  )
}