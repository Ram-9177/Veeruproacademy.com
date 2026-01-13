'use client'

import { useToast } from '@/lib/toast-context'
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 right-0 z-[9999] p-4 sm:p-6 flex flex-col gap-3 max-w-md pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastProps {
  toast: ReturnType<typeof useToast>['toasts'][0]
  onClose: () => void
}

function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 flex-shrink-0 animate-spin" />
      default:
        return <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/20 border border-green-500/30'
      case 'error':
        return 'bg-red-500/20 border border-red-500/30'
      case 'loading':
        return 'bg-blue-500/20 border border-blue-500/30'
      default:
        return 'bg-blue-500/20 border border-blue-500/30'
    }
  }

  return (
    <div
      className={`
        pointer-events-auto
        rounded-2xl p-4 backdrop-blur-md shadow-2xl
        flex items-start gap-3
        transition-all duration-300 ease-out
        ${getBgColor()}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      style={{ backgroundColor: 'rgba(17, 17, 17, 0.9)' }}
    >
      <div className="pt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words" style={{ color: '#ffffff' }}>
          {toast.message}
        </p>
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={handleClose}
          className="ml-2 flex-shrink-0 transition-colors hover:scale-110"
          style={{ color: '#a1a1aa' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
