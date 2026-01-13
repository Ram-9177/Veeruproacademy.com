"use client"

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, Circle, Trophy, Sparkles, ArrowRight } from 'lucide-react'
import { useCelebration } from '@/lib/celebration-context'
import { toggleLessonComplete, isLessonComplete, getStreak } from '@/lib/progress'
import { cn } from '@/lib/utils'

interface LessonCompleteButtonProps {
  lessonSlug: string
  lessonTitle: string
  courseSlug?: string
  courseTitle?: string
  totalLessonsInCourse?: number
  completedLessonsInCourse?: number
  nextLessonSlug?: string
  nextLessonTitle?: string
  className?: string
  variant?: 'default' | 'compact' | 'banner'
}

export function LessonCompleteButton({
  lessonSlug,
  lessonTitle,
  courseSlug: _courseSlug,
  courseTitle,
  totalLessonsInCourse,
  completedLessonsInCourse = 0,
  nextLessonSlug,
  nextLessonTitle: _nextLessonTitle,
  className,
  variant = 'default',
}: LessonCompleteButtonProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const { 
    celebrateLessonComplete, 
    celebrateCourseComplete, 
    celebrateStreak, 
    celebrateProgress,
    celebrateCertificate,
    showConfetti: _showConfetti 
  } = useCelebration()

  // Check initial state
  useEffect(() => {
    setIsComplete(isLessonComplete(lessonSlug))
  }, [lessonSlug])

  const handleToggle = useCallback(() => {
    const newState = toggleLessonComplete(lessonSlug)
    setIsComplete(newState)

    if (newState) {
      // Lesson marked as complete
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)

      // Celebrate lesson completion
      celebrateLessonComplete(lessonTitle)

      // Check for streak celebration
      const { streakDays } = getStreak()
      if (streakDays && [3, 7, 14, 30, 60, 100].includes(streakDays)) {
        setTimeout(() => {
          celebrateStreak(streakDays)
        }, 6000) // After lesson popup closes
      }

      // Check for course progress milestones
      if (courseTitle && totalLessonsInCourse && completedLessonsInCourse !== undefined) {
        const newCompleted = completedLessonsInCourse + 1
        const progressPercent = Math.round((newCompleted / totalLessonsInCourse) * 100)
        
        // Celebrate progress milestones
        if ([25, 50, 75, 90].includes(progressPercent)) {
          setTimeout(() => {
            celebrateProgress(progressPercent, courseTitle)
          }, 6000)
        }

        // Check for course completion
        if (newCompleted === totalLessonsInCourse) {
          setTimeout(() => {
            celebrateCourseComplete(courseTitle)
            // Also celebrate certificate
            setTimeout(() => {
              celebrateCertificate(courseTitle)
            }, 6000)
          }, 6000)
        }
      }
    }
  }, [
    lessonSlug, 
    lessonTitle, 
    courseTitle, 
    totalLessonsInCourse, 
    completedLessonsInCourse,
    celebrateLessonComplete, 
    celebrateCourseComplete, 
    celebrateStreak, 
    celebrateProgress,
    celebrateCertificate
  ])

  // Compact variant (just an icon button)
  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500",
          isComplete 
            ? "bg-emerald-100 hover:bg-emerald-200" 
            : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600",
          isAnimating && "scale-125",
          className
        )}
        aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
        title={isComplete ? "Mark as incomplete" : "Mark as complete"}
      >
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </button>
    )
  }

  // Banner variant (full-width completion banner)
  if (variant === 'banner') {
    return (
      <div className={cn(
        "rounded-xl border-2 p-6 transition-all duration-500",
        isComplete 
          ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5" 
          : "border-border bg-card hover:border-primary/50",
        className
      )}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-full transition-all duration-300",
              isComplete ? "bg-primary" : "bg-muted",
              isAnimating && "scale-110 animate-bounce"
            )}>
              {isComplete ? (
                <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Circle className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                isComplete ? "text-primary" : "text-foreground"
              )}>
                {isComplete ? "Lesson Completed! 🎉" : "Mark as Complete"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isComplete 
                  ? "Great job! You've mastered this lesson." 
                  : "Click to mark this lesson as complete and track your progress."
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleToggle}
              className={cn(
                "flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
                isComplete 
                  ? "bg-card border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary" 
                  : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 focus:ring-primary"
              )}
            >
              {isComplete ? (
                <>
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Completed
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Complete Lesson
                  </span>
                </>
              )}
            </button>
            
            {isComplete && nextLessonSlug && (
              <a
                href={`/lessons/${nextLessonSlug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-white font-medium hover:from-accent/90 hover:to-accent/70 transition-all shadow-lg shadow-accent/25"
              >
                Next Lesson
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        {courseTitle && totalLessonsInCourse && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Course Progress: {courseTitle}</span>
              <span className="font-medium">
                {isComplete ? completedLessonsInCourse + 1 : completedLessonsInCourse}/{totalLessonsInCourse} lessons
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((isComplete ? completedLessonsInCourse + 1 : completedLessonsInCourse) / totalLessonsInCourse) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default variant (standard button)
  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        isComplete 
          ? "bg-primary/10 text-primary border-2 border-primary hover:bg-primary/20" 
          : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25",
        isAnimating && "scale-105",
        className
      )}
    >
      <span className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full transition-all",
        isComplete ? "bg-primary" : "bg-card/20"
      )}>
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </span>
      <span>
        {isComplete ? "Completed ✓" : "Mark Complete"}
      </span>
    </button>
  )
}

export default LessonCompleteButton
