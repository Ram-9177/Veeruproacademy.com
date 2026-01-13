'use client'

import { Toaster as Sonner } from 'sonner'
import { useTheme } from 'next-themes'

export function SonnerToaster() {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-card border-border shadow-lg rounded-xl',
          title: 'text-foreground font-semibold',
          description: 'text-muted-foreground text-sm',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
          error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
          success: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
          warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
          info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
        },
      }}
      duration={4000}
      closeButton
      richColors
      expand
      visibleToasts={5}
    />
  )
}

// Export toast function for easy use everywhere
export { toast } from 'sonner'

// Helpful toast presets
export const toastHelpers = {
  success: (message: string, description?: string) => {
    const { toast } = require('sonner')
    return toast.success(message, { description })
  },
  
  error: (message: string, description?: string) => {
    const { toast } = require('sonner')
    return toast.error(message, { description })
  },
  
  info: (message: string, description?: string) => {
    const { toast } = require('sonner')
    return toast.info(message, { description })
  },
  
  warning: (message: string, description?: string) => {
    const { toast } = require('sonner')
    return toast.warning(message, { description })
  },
  
  loading: (message: string) => {
    const { toast } = require('sonner')
    return toast.loading(message)
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((_data: T) => string)
      error: string | ((_error: any) => string)
    }
  ) => {
    const { toast } = require('sonner')
    return toast.promise(promise, messages)
  },
  
  custom: (message: string, options?: any) => {
    const { toast } = require('sonner')
    return toast(message, options)
  },
}
