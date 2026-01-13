import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

type ProgressIndicatorProps = {
  steps: Array<{
    id: string
    title: string
    emoji: string
    completed?: boolean
  }>
  className?: string
}

export function ProgressIndicator({ steps, className }: ProgressIndicatorProps) {
  const [animatedSteps, setAnimatedSteps] = useState<string[]>([])

  useEffect(() => {
    // Animate steps one by one
    const timer = setTimeout(() => {
      steps.forEach((step, index) => {
        setTimeout(() => {
          setAnimatedSteps(prev => [...prev, step.id])
        }, index * 300)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [steps])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-2">Your Learning Journey</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 transform',
              animatedSteps.includes(step.id) 
                ? 'translate-x-0 opacity-100 border-emeraldGreen-200 bg-emeraldGreen-50' 
                : 'translate-x-4 opacity-70 border-lightGray-200 bg-white',
              step.completed && 'bg-emeraldGreen-100 border-emeraldGreen-300'
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              step.completed 
                ? 'bg-emeraldGreen-500 scale-110' 
                : animatedSteps.includes(step.id)
                ? 'bg-emeraldGreen-200 scale-105'
                : 'bg-lightGray-200'
            )}>
              {step.completed ? (
                <span className="text-white text-sm font-bold">✓</span>
              ) : (
                <span className="text-lg">{step.emoji}</span>
              )}
            </div>
            <div className="flex-1">
              <span className={cn(
                'font-medium transition-colors duration-300',
                step.completed ? 'text-emeraldGreen-700 line-through' : 'text-foreground'
              )}>
                {step.title}
              </span>
            </div>
            {animatedSteps.includes(step.id) && !step.completed && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-emeraldGreen-500 animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}