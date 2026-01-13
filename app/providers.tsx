'use client'

import { SessionProvider } from 'next-auth/react'
import { ToastProvider } from '@/lib/toast-context'
import { CelebrationProvider } from '@/lib/context/CelebrationContext'

export function Providers({ 
  children 
}: { 
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <CelebrationProvider>
          {children}
        </CelebrationProvider>
      </ToastProvider>
    </SessionProvider>
  )
}