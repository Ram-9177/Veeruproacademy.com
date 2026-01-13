"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { AchievementPopup, AchievementType } from '@/components/AchievementPopup'
import { Confetti } from '@/components/Confetti'

interface Achievement {
  type: AchievementType
  title: string
  description: string
  points?: number
  badge?: string
  unlocked?: string
}

interface CelebrationContextValue {
  // Show custom achievement
  celebrate: (_achievement: Achievement) => void
  // Convenience methods
  celebrateQuizComplete: (_score: number, _total: number, _quizTitle?: string) => void
  celebrateLessonComplete: (_lessonTitle: string) => void
  celebrateCourseComplete: (_courseTitle: string) => void
  celebrateStreak: (_days: number) => void
  celebrateMilestone: (_title: string, _description: string, _points?: number) => void
  celebrateFirstLesson: () => void
  celebrateBadge: (_badgeTitle: string, _badgeEmoji: string) => void
  celebrateCertificate: (_courseTitle: string) => void
  // Progress milestones
  celebrateProgress: (_percent: number, _courseTitle: string) => void
  // Just confetti, no popup
  showConfetti: (_particleCount?: number) => void
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null)

export function useCelebration() {
  const context = useContext(CelebrationContext)
  if (!context) {
    throw new Error('useCelebration must be used within a CelebrationProvider')
  }
  return context
}

interface CelebrationProviderProps {
  children: ReactNode
}

export function CelebrationProvider({ children }: CelebrationProviderProps) {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [showConfettiOnly, setShowConfettiOnly] = useState(false)
  const [confettiCount, setConfettiCount] = useState(50)
  const [_queue, setQueue] = useState<Achievement[]>([])

  const closeAchievement = useCallback(() => {
    setCurrentAchievement(null)
    // Show next in queue after a brief delay
    setTimeout(() => {
      setQueue(prev => {
        if (prev.length > 0) {
          const [next, ...rest] = prev
          setCurrentAchievement(next)
          return rest
        }
        return prev
      })
    }, 500)
  }, [])

  const celebrate = useCallback((achievement: Achievement) => {
    if (currentAchievement) {
      setQueue(prev => [...prev, achievement])
    } else {
      setCurrentAchievement(achievement)
    }
  }, [currentAchievement])

  const showConfetti = useCallback((particleCount = 50) => {
    setConfettiCount(particleCount)
    setShowConfettiOnly(true)
    setTimeout(() => setShowConfettiOnly(false), 4000)
  }, [])

  const celebrateQuizComplete = useCallback((score: number, total: number, quizTitle?: string) => {
    const percent = Math.round((score / total) * 100)
    const isPerfect = score === total
    const isGreat = percent >= 80

    celebrate({
      type: isPerfect ? 'perfect-score' : 'quiz-complete',
      title: isPerfect ? 'Perfect Score! 🌟' : isGreat ? 'Great Job! 🎯' : 'Quiz Complete!',
      description: isPerfect 
        ? `Incredible! You got all ${total} questions right${quizTitle ? ` on "${quizTitle}"` : ''}!`
        : `You scored ${score}/${total} (${percent}%)${quizTitle ? ` on "${quizTitle}"` : ''}`,
      points: isPerfect ? 100 : Math.round((score / total) * 50),
      badge: isPerfect ? '🏆' : isGreat ? '⭐' : '✅',
    })

    // Save to localStorage
    try {
      const achievements = JSON.parse(localStorage.getItem('learning_achievements') || '[]')
      achievements.push({
        type: 'quiz',
        score,
        total,
        percent,
        quizTitle,
        isPerfect,
        completedAt: new Date().toISOString(),
      })
      localStorage.setItem('learning_achievements', JSON.stringify(achievements))
    } catch (e) {
      console.error('Failed to save achievement:', e)
    }
  }, [celebrate])

  const celebrateLessonComplete = useCallback((lessonTitle: string) => {
    celebrate({
      type: 'lesson-complete',
      title: 'Lesson Complete! 📚',
      description: `You've finished "${lessonTitle}". Keep up the great work!`,
      points: 25,
      badge: '📖',
    })

    // Check for first lesson badge
    try {
      const completedLessons = JSON.parse(localStorage.getItem('completed_lessons') || '[]')
      if (completedLessons.length === 0) {
        // First lesson! Add to queue
        setTimeout(() => {
          celebrate({
            type: 'first-lesson',
            title: 'First Steps! 🚀',
            description: 'You\'ve completed your first lesson. Your learning journey begins!',
            points: 50,
            badge: '🎉',
          })
        }, 6000)
      }
      completedLessons.push({
        lessonTitle,
        completedAt: new Date().toISOString(),
      })
      localStorage.setItem('completed_lessons', JSON.stringify(completedLessons))
    } catch (e) {
      console.error('Failed to save lesson completion:', e)
    }
  }, [celebrate])

  const celebrateCourseComplete = useCallback((courseTitle: string) => {
    celebrate({
      type: 'course-complete',
      title: 'Course Completed! 🎓',
      description: `Congratulations! You've mastered "${courseTitle}"!`,
      points: 500,
      badge: '🎓',
    })

    // Save completion
    try {
      const completedCourses = JSON.parse(localStorage.getItem('completed_courses') || '[]')
      completedCourses.push({
        courseTitle,
        completedAt: new Date().toISOString(),
      })
      localStorage.setItem('completed_courses', JSON.stringify(completedCourses))
    } catch (e) {
      console.error('Failed to save course completion:', e)
    }
  }, [celebrate])

  const celebrateStreak = useCallback((days: number) => {
    celebrate({
      type: 'streak',
      title: `${days}-Day Streak! 🔥`,
      description: `You've been learning for ${days} days in a row. You're on fire!`,
      points: days * 10,
      badge: '🔥',
    })
  }, [celebrate])

  const celebrateMilestone = useCallback((title: string, description: string, points = 75) => {
    celebrate({
      type: 'milestone',
      title,
      description,
      points,
      badge: '🏅',
    })
  }, [celebrate])

  const celebrateFirstLesson = useCallback(() => {
    celebrate({
      type: 'first-lesson',
      title: 'First Steps! 🚀',
      description: 'You\'ve completed your first lesson. Your learning journey begins!',
      points: 50,
      badge: '🎉',
    })
  }, [celebrate])

  const celebrateBadge = useCallback((badgeTitle: string, badgeEmoji: string) => {
    celebrate({
      type: 'badge-earned',
      title: `Badge Earned: ${badgeTitle}`,
      description: `You've unlocked the "${badgeTitle}" badge!`,
      points: 50,
      badge: badgeEmoji,
    })
  }, [celebrate])

  const celebrateCertificate = useCallback((courseTitle: string) => {
    celebrate({
      type: 'certificate',
      title: 'Certificate Unlocked! 🏆',
      description: `You've earned a certificate for completing "${courseTitle}"!`,
      points: 200,
      badge: '📜',
    })
  }, [celebrate])

  const celebrateProgress = useCallback((percent: number, courseTitle: string) => {
    const milestones = [25, 50, 75, 90]
    const milestone = milestones.find(m => percent >= m && percent < m + 5)
    
    if (milestone) {
      const messages: Record<number, { title: string; description: string; emoji: string }> = {
        25: {
          title: 'Quarter Way There! 🌱',
          description: `You've completed 25% of "${courseTitle}". Great start!`,
          emoji: '🌱',
        },
        50: {
          title: 'Halfway Hero! ⚡',
          description: `You're halfway through "${courseTitle}". Keep pushing!`,
          emoji: '⚡',
        },
        75: {
          title: 'Almost There! 🎯',
          description: `75% of "${courseTitle}" complete. The finish line is in sight!`,
          emoji: '🎯',
        },
        90: {
          title: 'Final Sprint! 🏃',
          description: `90% done with "${courseTitle}". You're so close!`,
          emoji: '🏃',
        },
      }
      
      const msg = messages[milestone]
      celebrate({
        type: 'milestone',
        title: msg.title,
        description: msg.description,
        points: milestone,
        badge: msg.emoji,
      })
    }
  }, [celebrate])

  const value: CelebrationContextValue = {
    celebrate,
    celebrateQuizComplete,
    celebrateLessonComplete,
    celebrateCourseComplete,
    celebrateStreak,
    celebrateMilestone,
    celebrateFirstLesson,
    celebrateBadge,
    celebrateCertificate,
    celebrateProgress,
    showConfetti,
  }

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <AchievementPopup achievement={currentAchievement} onClose={closeAchievement} />
      <Confetti trigger={showConfettiOnly} particleCount={confettiCount} />
    </CelebrationContext.Provider>
  )
}

export default CelebrationProvider
