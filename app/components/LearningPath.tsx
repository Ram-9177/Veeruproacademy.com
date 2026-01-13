import { cn } from '@/lib/utils'
import { useState } from 'react'

type LearningStep = {
  id: string
  title: string
  description: string
  emoji: string
  duration: string
  completed?: boolean
  locked?: boolean
}

const learningPath: LearningStep[] = [
  {
    id: 'basics',
    title: 'Master the Basics',
    description: 'HTML, CSS, and JavaScript fundamentals',
    emoji: '🎯',
    duration: '2-3 weeks',
    completed: true
  },
  {
    id: 'frameworks',
    title: 'Modern Frameworks',
    description: 'React, Vue, or Angular development',
    emoji: '⚛️',
    duration: '3-4 weeks',
    completed: true
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Node.js, databases, and APIs',
    emoji: '🔧',
    duration: '4-5 weeks',
    completed: false
  },
  {
    id: 'deployment',
    title: 'Deploy & Scale',
    description: 'Cloud platforms and DevOps basics',
    emoji: '🚀',
    duration: '2-3 weeks',
    locked: true
  },
  {
    id: 'advanced',
    title: 'Advanced Concepts',
    description: 'Performance, security, and architecture',
    emoji: '🏗️',
    duration: '3-4 weeks',
    locked: true
  }
]

export function LearningPath() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Your Learning Adventure</h2>
        <p className="text-muted-foreground text-lg">Follow the path from beginner to full-stack developer</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[hsl(var(--neutral-border))] transform -translate-x-1/2 hidden md:block" />

        <div className="space-y-8">
          {learningPath.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'relative flex items-center gap-6 md:gap-8',
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              )}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Step content */}
              <div className={cn(
                'flex-1 p-6 rounded-xl border-2 transition-all duration-300 transform cursor-pointer',
                step.completed 
                  ? 'border-emeraldGreen-300 bg-emeraldGreen-50 hover:scale-105 hover:shadow-lg hover:shadow-emeraldGreen-200/50'
                  : step.locked 
                  ? 'border-lightGray-200 bg-lightGray-50 opacity-60'
                  : 'border-deepNavy-300 bg-deepNavy-50 hover:scale-105 hover:shadow-lg hover:shadow-deepNavy-200/50',
                hoveredStep === step.id && !step.locked ? 'scale-105 shadow-lg' : ''
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'text-4xl transform transition-transform duration-300',
                    hoveredStep === step.id && !step.locked ? 'scale-125 animate-bounce' : ''
                  )}>
                    {step.locked ? '🔒' : step.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={cn(
                        'text-lg font-semibold transition-colors duration-300',
                        step.completed ? 'text-emeraldGreen-700' :
                        step.locked ? 'text-muted-foreground/60' : 'text-foreground'
                      )}>
                        {step.title}
                      </h3>
                      {step.completed && (
                        <div className="w-6 h-6 rounded-full bg-emeraldGreen-500 flex items-center justify-center shadow-md">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <p className={cn(
                      'text-sm mb-3 transition-colors duration-300',
                      step.completed ? 'text-emeraldGreen-600' :
                      step.locked ? 'text-muted-foreground/60' : 'text-muted-foreground'
                    )}>
                      {step.description}
                    </p>
                    <div className={cn(
                      'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
                      step.completed ? 'bg-emeraldGreen-200 text-emeraldGreen-800' :
                      step.locked ? 'bg-lightGray-200 text-lightGray-600' : 'bg-deepNavy-200 text-deepNavy-800'
                    )}>
                      <span>⏱️</span>
                      {step.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step number indicator */}
              <div className={cn(
                'absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 items-center justify-center font-bold text-sm transition-all duration-300 hidden md:flex',
                step.completed 
                  ? 'bg-emeraldGreen-500 border-emeraldGreen-200 text-white scale-110'
                  : step.locked 
                  ? 'bg-lightGray-300 border-lightGray-200 text-lightGray-600'
                  : 'bg-deepNavy-500 border-deepNavy-200 text-white',
                hoveredStep === step.id && !step.locked ? 'scale-125' : ''
              )}>
                {step.completed ? '✓' : index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
