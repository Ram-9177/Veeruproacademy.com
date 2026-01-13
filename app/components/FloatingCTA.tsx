'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { cn } from '@/lib/utils'

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500 && !dismissed) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (dismissed) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 transition-all duration-500',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      )}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-slow" />
        
        {/* Main button */}
        <div className="relative bg-primary p-[2px] rounded-full shadow-2xl">
          <Button
            variant="primary"
            size="lg"
            href="/courses"
            className="rounded-full px-6 py-3 font-bold text-base gap-2 bg-primary hover:bg-primary/90 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            Learn Now
          </Button>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center hover:bg-destructive hover:border-destructive hover:text-destructive-foreground transition-all duration-200 shadow-lg"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
