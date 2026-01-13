import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type Skill = {
  name: string
  level: number
  maxLevel: number
  emoji: string
  color: string
}

const userSkills: Skill[] = [
  { name: 'HTML/CSS', level: 8, maxLevel: 10, emoji: '🎨', color: 'emeraldGreen' },
  { name: 'JavaScript', level: 6, maxLevel: 10, emoji: '⚡', color: 'deepNavy' },
  { name: 'React', level: 4, maxLevel: 10, emoji: '⚛️', color: 'softGold' },
  { name: 'Node.js', level: 2, maxLevel: 10, emoji: '🚀', color: 'coralRed' }
]

export function SkillProgress() {
  const [animatedLevels, setAnimatedLevels] = useState<Record<string, number>>({})

  useEffect(() => {
    // Animate skill bars one by one
    userSkills.forEach((skill, index) => {
      setTimeout(() => {
        let currentLevel = 0
        const timer = setInterval(() => {
          if (currentLevel >= skill.level) {
            clearInterval(timer)
            return
          }
          currentLevel += 0.2
          setAnimatedLevels(prev => ({
            ...prev,
            [skill.name]: Math.min(currentLevel, skill.level)
          }))
        }, 50)
      }, index * 300)
    })
  }, [])

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colorMap = {
      emeraldGreen: {
        bg: 'bg-emeraldGreen-500',
        text: 'text-emeraldGreen-600',
        border: 'border-emeraldGreen-200'
      },
      deepNavy: {
        bg: 'bg-deepNavy-500',
        text: 'text-deepNavy-600',
        border: 'border-deepNavy-200'
      },
      softGold: {
        bg: 'bg-softGold-500',
        text: 'text-softGold-600',
        border: 'border-softGold-200'
      },
      coralRed: {
        bg: 'bg-coralRed-500',
        text: 'text-coralRed-600',
        border: 'border-coralRed-200'
      }
    }
    return colorMap[color as keyof typeof colorMap]?.[type] || 'bg-lightGray-400'
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emeraldGreen-100 border border-emeraldGreen-200 text-emeraldGreen-700 font-medium text-sm mb-4">
          <span>📊</span>
          Your Progress
        </div>
        <h2 className="text-2xl font-bold text-deepNavy-900 mb-2">
          Level Up Your Skills
        </h2>
        <p className="text-slate-600">
          Track your progress and unlock new achievements as you learn
        </p>
      </div>

      <div className="space-y-6">
        {userSkills.map((skill, index) => (
          <div
            key={skill.name}
            className="p-6 bg-white rounded-xl border border-lightGray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
                  `bg-${skill.color}-100`
                )}>
                  <span className="text-xl">{skill.emoji}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-deepNavy-900">{skill.name}</h3>
                  <p className="text-sm text-slate-500">
                    Level {Math.floor(animatedLevels[skill.name] || 0)} / {skill.maxLevel}
                  </p>
                </div>
              </div>
              <div className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                skill.level >= 8 ? 'bg-emeraldGreen-100 text-emeraldGreen-700' :
                skill.level >= 5 ? 'bg-softGold-100 text-softGold-700' :
                'bg-lightGray-100 text-slate-600'
              )}>
                {skill.level >= 8 ? '🏆 Expert' : skill.level >= 5 ? '⭐ Intermediate' : '🌱 Learning'}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 bg-lightGray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-1000 ease-out relative',
                    getColorClasses(skill.color, 'bg')
                  )}
                  style={{ 
                    width: `${((animatedLevels[skill.name] || 0) / skill.maxLevel) * 100}%` 
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              
              {/* XP points */}
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{Math.floor((animatedLevels[skill.name] || 0) * 100)} XP</span>
                <span>{skill.maxLevel * 100} XP</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement section */}
      <div className="mt-8 p-6 bg-white rounded-xl border border-emeraldGreen-200">
        <div className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold text-emeraldGreen-800 mb-2">
            Next Achievement: React Master
          </h3>
          <p className="text-emeraldGreen-700 text-sm mb-4">
            Complete 3 more React projects to unlock this badge
          </p>
          <div className="w-full bg-emeraldGreen-200 rounded-full h-2">
            <div className="bg-emeraldGreen-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-emeraldGreen-600 mt-2">6/10 projects complete</p>
        </div>
      </div>
    </div>
  )
}
