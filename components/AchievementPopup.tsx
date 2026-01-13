"use client"

import { useEffect, useState, useCallback } from 'react'
import { X, Trophy, Star, Award, Sparkles, Zap, Target, Medal, Crown, Flame } from 'lucide-react'
import { Confetti } from './Confetti'

export type AchievementType = 
  | 'quiz-complete'
  | 'perfect-score'
  | 'lesson-complete'
  | 'course-complete'
  | 'streak'
  | 'first-lesson'
  | 'badge-earned'
  | 'milestone'
  | 'certificate'

interface Achievement {
  type: AchievementType
  title: string
  description: string
  points?: number
  badge?: string
  unlocked?: string // badge id or certificate id
}

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose: () => void
  autoClose?: number // ms to auto close, 0 to disable
}

const ACHIEVEMENT_CONFIG: Record<AchievementType, {
  icon: React.ReactNode
  bgGradient: string
  iconBg: string
  confettiCount: number
}> = {
  'quiz-complete': {
    icon: <Target className="w-8 h-8 text-white" />,
    bgGradient: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-400',
    confettiCount: 50,
  },
  'perfect-score': {
    icon: <Crown className="w-8 h-8 text-white" />,
    bgGradient: 'from-amber-400 to-orange-600',
    iconBg: 'bg-yellow-300',
    confettiCount: 100,
  },
  'lesson-complete': {
    icon: <Star className="w-8 h-8 text-white" />,
    bgGradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-400',
    confettiCount: 40,
  },
  'course-complete': {
    icon: <Trophy className="w-8 h-8 text-white" />,
    bgGradient: 'from-purple-500 to-pink-600',
    iconBg: 'bg-purple-400',
    confettiCount: 120,
  },
  'streak': {
    icon: <Flame className="w-8 h-8 text-white" />,
    bgGradient: 'from-orange-500 to-red-600',
    iconBg: 'bg-orange-400',
    confettiCount: 60,
  },
  'first-lesson': {
    icon: <Zap className="w-8 h-8 text-white" />,
    bgGradient: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-cyan-400',
    confettiCount: 50,
  },
  'badge-earned': {
    icon: <Award className="w-8 h-8 text-white" />,
    bgGradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-400',
    confettiCount: 70,
  },
  'milestone': {
    icon: <Medal className="w-8 h-8 text-white" />,
    bgGradient: 'from-amber-500 to-yellow-600',
    iconBg: 'bg-amber-400',
    confettiCount: 80,
  },
  'certificate': {
    icon: <Sparkles className="w-8 h-8 text-white" />,
    bgGradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-400',
    confettiCount: 100,
  },
}

export function AchievementPopup({ achievement, onClose, autoClose = 5000 }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }, [onClose])

  useEffect(() => {
    if (achievement) {
      // Trigger entrance animation
      requestAnimationFrame(() => {
        setIsVisible(true)
        setShowConfetti(true)
      })

      // Stop confetti after a delay
      const confettiTimer = setTimeout(() => setShowConfetti(false), 4000)

      // Auto close if enabled
      let closeTimer: NodeJS.Timeout | null = null
      if (autoClose > 0) {
        closeTimer = setTimeout(handleClose, autoClose)
      }

      return () => {
        clearTimeout(confettiTimer)
        if (closeTimer) clearTimeout(closeTimer)
      }
    } else {
      setIsVisible(false)
      setShowConfetti(false)
    }
  }, [achievement, autoClose, handleClose])

  if (!achievement) return null

  const config = ACHIEVEMENT_CONFIG[achievement.type]

  return (
    <>
      <Confetti 
        trigger={showConfetti} 
        particleCount={config.confettiCount}
        duration={4000}
      />
      
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Popup */}
      <div 
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-sm transition-all duration-500 ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-[-50%]' 
            : 'opacity-0 scale-75 translate-y-[-40%]'
        }`}
        role="dialog"
        aria-labelledby="achievement-title"
        aria-describedby="achievement-desc"
      >
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bgGradient} p-1 shadow-2xl`}>
          {/* Inner card */}
          <div className="relative rounded-xl bg-card p-6">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Icon with animated ring */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center shadow-lg animate-bounce`}>
                  {achievement.badge ? (
                    <span className="text-3xl">{achievement.badge}</span>
                  ) : (
                    config.icon
                  )}
                </div>
                {/* Animated ring */}
                <div className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r ${config.bgGradient} opacity-50 animate-ping`} 
                  style={{ animationDuration: '1.5s' }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                🎉 Achievement Unlocked!
              </p>
              <h3 
                id="achievement-title" 
                className="text-xl font-bold text-foreground mb-2"
              >
                {achievement.title}
              </h3>
              <p 
                id="achievement-desc" 
                className="text-sm text-muted-foreground mb-4"
              >
                {achievement.description}
              </p>

              {/* Points badge */}
              {achievement.points && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-700">+{achievement.points} XP</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleClose}
                className={`flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r ${config.bgGradient} text-white font-medium text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Awesome! 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Hook for easy achievement triggering
export function useAchievement() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [_queue, setQueue] = useState<Achievement[]>([])

  const showAchievement = useCallback((achievement: Achievement) => {
    if (currentAchievement) {
      // Queue if one is already showing
      setQueue(prev => [...prev, achievement])
    } else {
      setCurrentAchievement(achievement)
    }
  }, [currentAchievement])

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

  return {
    currentAchievement,
    showAchievement,
    closeAchievement,
    // Convenience methods
    showQuizComplete: (score: number, total: number) => {
      const isPerfect = score === total
      showAchievement({
        type: isPerfect ? 'perfect-score' : 'quiz-complete',
        title: isPerfect ? 'Perfect Score! 🌟' : 'Quiz Complete!',
        description: isPerfect 
          ? `Incredible! You got all ${total} questions right!`
          : `You scored ${score}/${total} (${Math.round((score/total)*100)}%)`,
        points: isPerfect ? 100 : Math.round((score/total) * 50),
        badge: isPerfect ? '🏆' : '✅',
      })
    },
    showLessonComplete: (lessonTitle: string) => {
      showAchievement({
        type: 'lesson-complete',
        title: 'Lesson Complete!',
        description: `You've finished "${lessonTitle}". Keep up the great work!`,
        points: 25,
        badge: '📚',
      })
    },
    showCourseComplete: (courseTitle: string) => {
      showAchievement({
        type: 'course-complete',
        title: 'Course Completed! 🎓',
        description: `Congratulations! You've completed "${courseTitle}"!`,
        points: 500,
        badge: '🎓',
      })
    },
    showStreak: (days: number) => {
      showAchievement({
        type: 'streak',
        title: `${days}-Day Streak! 🔥`,
        description: `You've been learning for ${days} days in a row. Unstoppable!`,
        points: days * 10,
        badge: '🔥',
      })
    },
    showMilestone: (milestone: string, description: string) => {
      showAchievement({
        type: 'milestone',
        title: milestone,
        description,
        points: 75,
        badge: '🏅',
      })
    },
  }
}

export default AchievementPopup
