'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

type AchievementBadgeProps = {
  title: string
  description: string
  emoji: string
  earned?: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  className?: string
  onClick?: () => void
}

export function AchievementBadge({ 
  title, 
  description, 
  emoji, 
  earned = false, 
  rarity = 'common',
  className,
  onClick 
}: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const rarityStyles = {
    common: 'border-lightGray-300 bg-lightGray-50',
    rare: 'border-emeraldGreen-300 bg-emeraldGreen-50',
    epic: 'border-deepNavy-300 bg-deepNavy-50',
    legendary: 'border-softGold-300 bg-softGold-50'
  }

  const rarityGlow = {
    common: '',
    rare: 'group-hover:shadow-emeraldGreen-200/50',
    epic: 'group-hover:shadow-deepNavy-200/50',
    legendary: 'group-hover:shadow-softGold-300/50'
  }

  return (
    <div 
      className={cn(
        'group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
        'hover:scale-105 hover:shadow-lg',
        earned ? rarityStyles[rarity] : 'border-lightGray-200 bg-lightGray-25',
        earned ? rarityGlow[rarity] : '',
        !earned && 'opacity-60 grayscale hover:grayscale-0 hover:opacity-80',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sparkle effect for earned badges */}
      {earned && (
        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 rounded-full bg-emeraldGreen-500 flex items-center justify-center animate-ping shadow-lg">
            <span className="text-white text-xs font-bold">✨</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className={cn(
          'text-4xl mb-2 transition-transform duration-300',
          isHovered && earned ? 'scale-125 animate-bounce' : 'scale-100'
        )}>
          {emoji}
        </div>
        
        <h3 className={cn(
          'font-semibold text-sm mb-1 transition-colors duration-300',
          earned ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {title}
        </h3>
        
        <p className={cn(
          'text-xs leading-tight transition-colors duration-300',
          earned ? 'text-muted-foreground' : 'text-muted-foreground/60'
        )}>
          {description}
        </p>

        {/* Rarity indicator - static 4 dots to avoid hydration mismatch */}
        <div className="mt-3 flex justify-center">
          <div className="flex gap-1">
            {/* Dot 1 - always shown for any rarity */}
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                earned 
                  ? rarity === 'legendary' ? 'bg-softGold-400' :
                    rarity === 'epic' ? 'bg-deepNavy-400' :
                    rarity === 'rare' ? 'bg-emeraldGreen-400' : 'bg-lightGray-400'
                  : 'bg-lightGray-300'
              )}
            />
            {/* Dot 2 - shown for rare, epic, legendary */}
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary')
                  ? (earned 
                      ? rarity === 'legendary' ? 'bg-softGold-400' :
                        rarity === 'epic' ? 'bg-deepNavy-400' : 'bg-emeraldGreen-400'
                      : 'bg-lightGray-300')
                  : 'hidden'
              )}
            />
            {/* Dot 3 - shown for epic, legendary */}
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                (rarity === 'epic' || rarity === 'legendary')
                  ? (earned 
                      ? rarity === 'legendary' ? 'bg-softGold-400' : 'bg-deepNavy-400'
                      : 'bg-lightGray-300')
                  : 'hidden'
              )}
            />
            {/* Dot 4 - shown for legendary only */}
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                rarity === 'legendary'
                  ? (earned ? 'bg-softGold-400' : 'bg-lightGray-300')
                  : 'hidden'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
