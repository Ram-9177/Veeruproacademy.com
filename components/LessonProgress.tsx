"use client"
import React, { useEffect, useRef, useState } from 'react'
import { isLessonComplete, toggleLessonComplete, getStreak } from '@/lib/progress'
import { publish } from '@/lib/events'
import { evaluateBadges } from '../lib/badges'
import { Confetti } from './Confetti'
import { ProgressBar } from './ProgressBar'

export function LessonProgress({ lessonSlug }: { lessonSlug: string }) {
  const [complete, setComplete] = useState(false)
  const [streak, setStreak] = useState<{ streakDays: number; streakStart?: string }>({ streakDays: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const wasCompleteRef = useRef(false)

  useEffect(() => {
    const initialComplete = isLessonComplete(lessonSlug)
    setComplete(initialComplete)
    wasCompleteRef.current = initialComplete
    setStreak(getStreak())
    try {
      const key = 'vpac:recentLessons:v1'
      const raw = localStorage.getItem(key)
      const arr: string[] = raw ? JSON.parse(raw) : []
      const filtered = arr.filter(s => s !== lessonSlug)
      filtered.unshift(lessonSlug)
      localStorage.setItem(key, JSON.stringify(filtered.slice(0, 25)))
  } catch (_err) { /* ignore recent lessons update error */ }
    publish('lesson:view', { slug: lessonSlug })
    const sentinel = document.getElementById('lesson-end')
    if (sentinel) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !isLessonComplete(lessonSlug)) {
            const nowComplete = toggleLessonComplete(lessonSlug)
            setComplete(nowComplete)
            const s = getStreak()
            setStreak(s)
            
            // Show confetti if just completed
            if (nowComplete && !wasCompleteRef.current) {
              setShowConfetti(true)
              setTimeout(() => setShowConfetti(false), 3000)
            }
            wasCompleteRef.current = nowComplete
            
            try {
              const raw = localStorage.getItem('academy:progress:v1')
              if (raw) {
                const data = JSON.parse(raw)
                const lessons = data.lessons || {}
                const completedCount = Object.values(lessons).filter(Boolean).length
                evaluateBadges({ completedCount, streakDays: s.streakDays || 0 })
              }
            } catch (_err) { /* ignore badge evaluation error */ }
            publish('lesson:autoComplete', { slug: lessonSlug })
          }
        })
      }, { threshold: 1 })
      io.observe(sentinel)
      return () => io.disconnect()
    }
  }, [lessonSlug])

  const toggle = () => {
    const nowComplete = toggleLessonComplete(lessonSlug)
    setComplete(nowComplete)
    const s = getStreak()
    setStreak(s)
    
    // Show confetti if just completed
    if (nowComplete && !wasCompleteRef.current) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
    wasCompleteRef.current = nowComplete
    
    try {
      const raw = localStorage.getItem('academy:progress:v1')
      if (raw) {
        const data = JSON.parse(raw)
        const lessons = data.lessons || {}
        const completedCount = Object.values(lessons).filter(Boolean).length
        evaluateBadges({ completedCount, streakDays: s.streakDays || 0 })
      }
  } catch (_err) { /* ignore badge evaluation error */ }
    publish('lesson:toggleComplete', { slug: lessonSlug, complete: nowComplete })
  }

  return (
    <>
      <Confetti trigger={showConfetti} />
      <div className="mt-8 space-y-4 border border-border rounded-lg p-4 bg-card" role="group" aria-label="Lesson progress">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Lesson Progress</span>
            <span className="text-xs text-muted-foreground">Streak: {streak.streakDays} day{streak.streakDays === 1 ? '' : 's'}</span>
          </div>
          <button
        onClick={toggle}
        className={"px-4 py-2 text-sm rounded-md font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-[44px] min-w-[120px] " + (complete ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95' : 'bg-muted text-muted-foreground hover:bg-muted/90 hover:scale-105 active:scale-95')}
        aria-pressed={complete}
      >
        {complete ? '✓ Completed' : 'Mark Complete'}
      </button>
        </div>
        <ProgressBar 
          value={complete ? 100 : 0} 
          label="Completion"
          showValue={true}
          color="emerald"
          size="md"
          animated={true}
          aria-label={`Lesson completion: ${complete ? '100' : '0'}%`}
        />
      </div>
    </>
  )
}
