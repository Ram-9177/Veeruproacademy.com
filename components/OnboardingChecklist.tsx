'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Sparkles, BookOpen, Code, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItem {
  id: string
  label: string
  icon: React.ReactNode
  action?: () => void
  href?: string
}

const defaultChecklist: ChecklistItem[] = [
  {
    id: 'explore-courses',
    label: 'Explore available courses',
    icon: <BookOpen className="h-4 w-4" />,
    href: '/courses',
  },
  {
    id: 'complete-first-lesson',
    label: 'Complete your first lesson',
    icon: <Circle className="h-4 w-4" />,
    href: '/lessons',
  },
  {
    id: 'try-sandbox',
    label: 'Try the code sandbox',
    icon: <Code className="h-4 w-4" />,
    href: '/sandbox',
  },
  {
    id: 'earn-badge',
    label: 'Earn your first badge',
    icon: <Trophy className="h-4 w-4" />,
  },
]

export function OnboardingChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('onboarding:completed')
    if (saved) {
      try {
        setCompleted(new Set(JSON.parse(saved)))
      } catch {
        // ignore
      }
    }
    const dismissed = localStorage.getItem('onboarding:dismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
    }
  }, [])

  const toggleItem = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem('onboarding:completed', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('onboarding:dismissed', 'true')
  }

  if (isDismissed) return null

  const allCompleted = defaultChecklist.every(item => completed.has(item.id))

  return (
    <div 
      className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 shadow-lg"
      role="region"
      aria-label="Onboarding checklist"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h3 className="text-lg font-bold text-neutral-900">Getting Started</h3>
        </div>
        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Dismiss onboarding checklist"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-neutral-600 mb-4">
  Complete these steps to get the most out of Veeru&apos;s Pro Academy:
      </p>

      <ul className="space-y-3" role="list">
        {defaultChecklist.map(item => {
          const isCompleted = completed.has(item.id)
          return (
            <li key={item.id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleItem(item.id)}
                  className="sr-only"
                  aria-label={item.label}
                />
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all',
                    isCompleted
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-neutral-300 group-hover:border-emerald-500'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4 text-transparent" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className={cn(
                    'text-sm transition-colors',
                    isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-900'
                  )}>
                    {item.label}
                  </span>
                  {item.href && !isCompleted && (
                    <a
                      href={item.href}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Go →
                    </a>
                  )}
                </div>
              </label>
            </li>
          )
        })}
      </ul>

      {allCompleted && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-100 border border-emerald-200">
          <p className="text-sm font-medium text-emerald-800 text-center">
            🎉 Great job! You&apos;re all set to learn now!
          </p>
        </div>
      )}
    </div>
  )
}

