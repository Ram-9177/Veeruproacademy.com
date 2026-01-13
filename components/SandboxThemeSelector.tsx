"use client"

import { useState, type ReactNode } from 'react'
import { Sun, Moon, Code2, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'monokai' | 'github'

interface SandboxThemeSelectorProps {
  onThemeChange?: (_nextTheme: Theme) => void
  className?: string
}

const themes: Array<{ value: Theme; label: string; icon: ReactNode }> = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'monokai', label: 'Monokai', icon: <Code2 className="h-4 w-4" /> },
  { value: 'github', label: 'GitHub', icon: <Palette className="h-4 w-4" /> },
]

export function SandboxThemeSelector({ onThemeChange, className }: SandboxThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dark')

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme)
    onThemeChange?.(theme)
    
    // Apply theme to editor
    const editor = document.querySelector('[data-code-editor]')
    if (editor) {
      editor.classList.remove('theme-light', 'theme-dark', 'theme-monokai', 'theme-github')
      editor.classList.add(`theme-${theme}`)
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)} role="group" aria-label="Code editor theme">
      <span className="text-xs font-medium text-muted-foreground">Theme:</span>
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {themes.map(theme => (
          <button
            key={theme.value}
            onClick={() => handleThemeChange(theme.value)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all',
              selectedTheme === theme.value
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted'
            )}
            aria-label={`Switch to ${theme.label} theme`}
            aria-pressed={selectedTheme === theme.value}
          >
            {theme.icon}
            <span className="hidden sm:inline">{theme.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

