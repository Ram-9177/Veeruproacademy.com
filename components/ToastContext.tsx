import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

type Toast = { id: string; message: string; type?: 'info' | 'success' | 'error' }

const ToastContext = createContext<{ show: (_message: string, _type?: Toast['type']) => void } | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(t => [...t, { id, message, type }])
    // auto remove
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  // small cleanup on unmount
  useEffect(() => {
    return () => setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t, i) => (
          <div
            key={t.id}
            role="status"
            className={`toast px-4 py-2 rounded shadow-lg transform transition-all duration-300 ease-out ${t.type === 'success' ? 'toast-success' : t.type === 'error' ? 'toast-error' : 'toast-info'}`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="text-sm">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastContext
