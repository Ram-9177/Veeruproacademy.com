// Toast notification service with React Context
'use client'

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'loading'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (_message: string, _type?: ToastType, _duration?: number) => string
  removeToast: (_id: string) => void
  showSuccess: (_message: string, _duration?: number) => void
  showError: (_message: string, _duration?: number) => void
  showLoading: (_message: string) => string
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps): React.ReactElement => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast_${Date.now()}_${Math.random()}`
    const toast: Toast = { id, type, message, duration }

    setToasts(prev => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }

    return id
  }, [removeToast])

  const showSuccess = useCallback((message: string, duration?: number) => {
    return addToast(message, 'success', duration)
  }, [addToast])

  const showError = useCallback((message: string, duration?: number) => {
    return addToast(message, 'error', duration || 5000)
  }, [addToast])

  const showLoading = useCallback((message: string) => {
    return addToast(message, 'loading', 0)
  }, [addToast])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showLoading,
    clearToasts
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
