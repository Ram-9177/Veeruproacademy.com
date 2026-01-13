"use client"

import { useState, useEffect, useCallback } from 'react'
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Play, 
  Flame,
  Target,
  Star
} from 'lucide-react'
import { 
  getCourseProgress, 
  enrollInCourse,
  updateCourseProgress,
  completeLessonInCourse,
  getUserStats,
  CourseProgress 
} from '@/lib/progress'
import { useCelebration } from '@/lib/celebration-context'
import { cn } from '@/lib/utils'

interface CourseProgressTrackerProps {
  courseSlug: string
  courseTitle: string
  totalLessons: number
  currentLessonSlug?: string
  currentLessonTitle?: string
  onLessonComplete?: (_lessonSlug: string) => void
  variant?: 'sidebar' | 'card' | 'banner' | 'minimal'
  className?: string
}

export function CourseProgressTracker({
  courseSlug,
  courseTitle,
  totalLessons,
  currentLessonSlug,
  currentLessonTitle,
  onLessonComplete,
  variant = 'card',
  className
}: CourseProgressTrackerProps) {
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [stats, setStats] = useState({ totalXP: 0, level: 1, streakDays: 0 })
  const { celebrateProgress, celebrateCourseComplete, showConfetti } = useCelebration()

  // Load progress on mount
  useEffect(() => {
    const courseProgress = getCourseProgress(courseSlug)
    if (courseProgress) {
      setProgress(courseProgress)
      setIsEnrolled(true)
    }
    setStats(getUserStats())
  }, [courseSlug])

  // Update current lesson position when it changes
  useEffect(() => {
    if (isEnrolled && currentLessonSlug) {
      const updated = updateCourseProgress(courseSlug, currentLessonSlug, currentLessonTitle)
      if (updated) setProgress(updated)
    }
  }, [courseSlug, currentLessonSlug, currentLessonTitle, isEnrolled])

  const handleEnroll = useCallback(() => {
    const newProgress = enrollInCourse(courseSlug, totalLessons)
    setProgress(newProgress)
    setIsEnrolled(true)
    showConfetti(30)
  }, [courseSlug, totalLessons, showConfetti])

  const handleMarkComplete = useCallback(() => {
    if (!currentLessonSlug) return
    
    const { courseProgress, isNewCompletion, isCourseComplete } = completeLessonInCourse(
      courseSlug,
      currentLessonSlug
    )

    if (courseProgress) {
      setProgress(courseProgress)
      setStats(getUserStats())

      if (isNewCompletion) {
        // Check for progress milestones
        if ([25, 50, 75].includes(courseProgress.progressPercent)) {
          celebrateProgress(courseProgress.progressPercent, courseTitle)
        }

        if (isCourseComplete) {
          celebrateCourseComplete(courseTitle)
        }

        onLessonComplete?.(currentLessonSlug)
      }
    }
  }, [courseSlug, currentLessonSlug, courseTitle, celebrateProgress, celebrateCourseComplete, onLessonComplete])

  // Format time
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const isCurrentLessonComplete = progress?.lessonsCompleted.includes(currentLessonSlug || '')

  // Minimal variant - just a progress bar
  if (variant === 'minimal') {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-primary">{progress?.progressPercent || 0}%</span>
        </div>
        <div className="h-2 bg-accent rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
            style={{ width: `${progress?.progressPercent || 0}%` }}
          />
        </div>
      </div>
    )
  }

  // Sidebar variant - compact for sidebar use
  if (variant === 'sidebar') {
    return (
      <div className={cn("bg-card rounded-xl border border-border p-4 space-y-4", className)}>
        {/* Progress Circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="hsl(var(--border))"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#progressGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * (progress?.progressPercent || 0)) / 100}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-primary-accent)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">{progress?.progressPercent || 0}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Course Progress</p>
            <p className="text-xs text-muted-foreground">
              {progress?.lessonsCompleted.length || 0}/{totalLessons} lessons
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="font-semibold">{stats.streakDays}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="font-semibold">{stats.totalXP} XP</span>
          </div>
          <div className="flex items-center gap-1 text-purple-400">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold">Lv.{stats.level}</span>
          </div>
        </div>

        {/* Resume/Complete Button */}
        {isEnrolled && currentLessonSlug && (
          <button
            onClick={isCurrentLessonComplete ? undefined : handleMarkComplete}
            disabled={isCurrentLessonComplete}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all",
              isCurrentLessonComplete
                ? "bg-primary/20 text-primary cursor-default"
                : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25",
              !isCurrentLessonComplete && "text-primary-foreground"
            )}
          >
            {isCurrentLessonComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Mark Complete
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  // Banner variant - full width
  if (variant === 'banner') {
    if (!isEnrolled) {
      return (
        <div className={cn(
          "bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground",
          className
        )}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Learn {courseTitle}</h3>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Learn now to track your progress and earn achievements!
              </p>
            </div>
            <button
              onClick={handleEnroll}
              className="flex items-center gap-2 px-6 py-3 bg-card text-primary font-semibold rounded-lg hover:bg-muted transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Free Course
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className={cn(
        "bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground",
        className
      )}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Progress Circle */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeOpacity="0.2" strokeWidth="6" fill="none" />
                <circle
                  cx="40" cy="40" r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * (progress?.progressPercent || 0)) / 100}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{progress?.progressPercent || 0}%</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold">{courseTitle}</h3>
              <p className="text-primary-foreground/80 text-sm">
                {progress?.lessonsCompleted.length || 0} of {totalLessons} lessons completed
              </p>
              {progress?.currentLessonTitle && (
                <p className="text-sm mt-1 text-primary-foreground/70">
                  Currently: {progress.currentLessonTitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(progress?.timeSpentTotal || 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>{stats.streakDays} day streak</span>
              </div>
            </div>

            {/* Action Button */}
            {currentLessonSlug && (
              <button
                onClick={isCurrentLessonComplete ? undefined : handleMarkComplete}
                disabled={isCurrentLessonComplete}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all",
                  isCurrentLessonComplete
                    ? "bg-card/20 cursor-default"
                    : "bg-card hover:bg-muted shadow-lg",
                  isCurrentLessonComplete ? "text-card-foreground" : "text-primary"
                )}
              >
                {isCurrentLessonComplete ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Lesson Complete
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    Mark Complete
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default card variant
  return (
    <div className={cn(
      "bg-card rounded-2xl border border-border shadow-sm overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Your Progress</h3>
              <p className="text-sm text-primary-foreground/80">{courseTitle}</p>
            </div>
          </div>
          {isEnrolled && (
            <div className="text-right">
              <p className="text-3xl font-bold">{progress?.progressPercent || 0}%</p>
              <p className="text-xs text-primary-foreground/80">completed</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {!isEnrolled ? (
          // Not enrolled - show enroll CTA
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Ready to Start?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Enroll in this free course to track your progress and earn achievements!
            </p>
            <button
              onClick={handleEnroll}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg shadow-primary/25"
            >
              Start Free Course
            </button>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Lessons Completed</span>
                <span className="font-semibold text-foreground">
                  {progress?.lessonsCompleted.length || 0}/{totalLessons}
                </span>
              </div>
              <div className="h-3 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{ width: `${progress?.progressPercent || 0}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-500/10 rounded-xl p-3 text-center">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-orange-300">{stats.streakDays}</p>
                <p className="text-xs text-orange-400/70">Day Streak</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-3 text-center">
                <Star className="w-5 h-5 text-amber-400 mx-auto mb-1 fill-amber-400" />
                <p className="text-lg font-bold text-amber-300">{stats.totalXP}</p>
                <p className="text-xs text-amber-400/70">Total XP</p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-3 text-center">
                <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-300">Lv.{stats.level}</p>
                <p className="text-xs text-purple-400/70">Your Level</p>
              </div>
            </div>

            {/* Resume Info */}
            {progress?.currentLessonTitle && (
              <div className="bg-accent rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Continue Learning</p>
                <p className="font-semibold text-foreground truncate">{progress.currentLessonTitle}</p>
              </div>
            )}

            {/* Complete Button */}
            {currentLessonSlug && (
              <button
                onClick={isCurrentLessonComplete ? undefined : handleMarkComplete}
                disabled={isCurrentLessonComplete}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all",
                  isCurrentLessonComplete
                    ? "bg-primary/20 text-primary cursor-default"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25",
                  !isCurrentLessonComplete && "text-primary-foreground"
                )}
              >
                {isCurrentLessonComplete ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Lesson Completed
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5" />
                    Mark as Complete
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CourseProgressTracker
 