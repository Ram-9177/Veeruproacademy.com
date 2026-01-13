'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, Contrast } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'high-contrast'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved && ['light', 'dark', 'high-contrast'].includes(saved)) {
      setTheme(saved)
      applyTheme(saved)
    } else {
      applyTheme('light')
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'high-contrast')
    root.classList.add(newTheme)
    
    if (newTheme === 'high-contrast') {
      root.style.setProperty('--color-primary', '#000000')
      root.style.setProperty('--color-accent', '#FFFFFF')
      root.style.setProperty('--color-neutral-900', '#000000')
      root.style.setProperty('--color-neutral-50', '#FFFFFF')
      root.style.setProperty('--color-emerald-600', '#00FF00')
      root.style.setProperty('--color-emerald-700', '#00CC00')
      root.style.setProperty('background-color', '#FFFFFF')
      root.style.setProperty('color', '#000000')
    } else {
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-accent')
      root.style.removeProperty('--color-neutral-900')
      root.style.removeProperty('--color-neutral-50')
      root.style.removeProperty('--color-emerald-600')
      root.style.removeProperty('--color-emerald-700')
      root.style.removeProperty('background-color')
      root.style.removeProperty('color')
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100">
        <Sun className="h-4 w-4" />
      </div>
    )
  }

  return (
    <div 
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border shadow-sm"
      role="group"
      aria-label="Theme selector"
    >
      <button
        onClick={() => handleThemeChange('light')}
        className={cn(
          'p-1.5 rounded transition-colors',
          theme === 'light' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:bg-muted'
        )}
        aria-label="Light theme"
        aria-pressed={theme === 'light'}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={cn(
          'p-1.5 rounded transition-colors',
          theme === 'dark' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:bg-muted'
        )}
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleThemeChange('high-contrast')}
        className={cn(
          'p-1.5 rounded transition-colors',
          theme === 'high-contrast' 
            ? 'bg-primary/20 text-primary' 
            : 'text-muted-foreground hover:bg-muted'
        )}
        aria-label="High contrast theme"
        aria-pressed={theme === 'high-contrast'}
      >
        <Contrast className="h-4 w-4" />
      </button>
    </div>
  )
}

