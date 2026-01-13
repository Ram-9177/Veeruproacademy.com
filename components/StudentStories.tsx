'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from '@/app/components/SafeImage'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentStory {
  id: string
  name: string
  avatar: string
  role: string
  quote: string
  achievement: string
  rating: number
}

const stories: StudentStory[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'Frontend Developer at TechCorp',
  quote: 'Veeru\'s Pro Academy helped me land my dream job in just 3 months. The hands-on projects were exactly what employers were looking for.',
    achievement: 'Got hired at ₹12L package',
    rating: 5,
  },
  {
    id: '2',
    name: 'Rahul Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'Full-Stack Developer',
    quote: 'The sandbox feature is a game-changer. I could practice and build projects without any setup hassle.',
    achievement: 'Built 10+ portfolio projects',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ananya Reddy',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'UI/UX Designer → Developer',
    quote: 'Transitioning from design to development was seamless with Veeru\'s structured courses and real-world projects.',
    achievement: 'Career transition success',
    rating: 5,
  },
  {
    id: '4',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    role: 'Freelance Developer',
    quote: 'The premium projects gave me high-quality templates I could customize for clients. ROI was immediate!',
    achievement: '3x increase in client projects',
    rating: 5,
  },
]

export function StudentStories({ autoRotate = true, interval = 5000 }: { autoRotate?: boolean; interval?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoRotate) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % stories.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoRotate, interval])

  const next = () => setCurrentIndex(prev => (prev + 1) % stories.length)
  const prev = () => setCurrentIndex(prev => (prev - 1 + stories.length) % stories.length)

  const currentStory = stories[currentIndex]

  return (
    <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm" role="region" aria-label="Student success stories">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Student Success Stories</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Previous story"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {stories.length}
          </span>
          <button
            onClick={next}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Next story"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary">
          <SafeImage
            src={currentStory.avatar}
            alt={currentStory.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{currentStory.name}</h4>
            <div className="flex items-center gap-0.5">
              {/* Static 5 stars to avoid hydration mismatch */}
              <span className={currentStory.rating >= 1 ? 'text-yellow-400' : 'text-muted-foreground'} aria-hidden="true">⭐</span>
              <span className={currentStory.rating >= 2 ? 'text-yellow-400' : 'text-muted-foreground'} aria-hidden="true">⭐</span>
              <span className={currentStory.rating >= 3 ? 'text-yellow-400' : 'text-muted-foreground'} aria-hidden="true">⭐</span>
              <span className={currentStory.rating >= 4 ? 'text-yellow-400' : 'text-muted-foreground'} aria-hidden="true">⭐</span>
              <span className={currentStory.rating >= 5 ? 'text-yellow-400' : 'text-muted-foreground'} aria-hidden="true">⭐</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{currentStory.role}</p>
          <p className="text-sm text-foreground italic mb-3">&quot;{currentStory.quote}&quot;</p>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <span>🎯</span>
            {currentStory.achievement}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6 justify-center" role="tablist">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              'h-2 rounded-full transition-all',
              idx === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-muted hover:bg-muted-foreground/50'
            )}
            aria-label={`Go to story ${idx + 1}`}
            role="tab"
            aria-selected={idx === currentIndex}
          />
        ))}
      </div>
    </div>
  )
}

