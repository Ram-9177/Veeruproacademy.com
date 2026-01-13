'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SavedIndicatorProps {
  isSaving?: boolean
  lastSaved?: Date
  className?: string
}

export function SavedIndicator({ isSaving = false, lastSaved, className }: SavedIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true)
      const timer = setTimeout(() => setShowSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSaving, lastSaved])

  if (isSaving) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-neutral-600', className)}>
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span>Saving...</span>
      </div>
    )
  }

  if (showSaved && lastSaved) {
    return (
      <div 
        className={cn(
          'flex items-center gap-2 text-sm text-emerald-600 animate-in fade-in slide-in-from-bottom-2',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        <span>Saved {lastSaved.toLocaleTimeString()}</span>
      </div>
    )
  }

  return null
}

