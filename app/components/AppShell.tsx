"use client"

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

import { ThemeProvider as Provider } from '@/components/theme-provider'
import { SimpleNavbar } from '@/app/components/SimpleNavbar'
import CmsBanner from '@/app/components/CmsBanner'
import CmsFooter from '@/app/components/CmsFooter'
import { FloatingCTA } from '@/app/components/FloatingCTA'
import { ErrorBoundary } from '@/app/components/ErrorBoundary'
import { Toaster } from 'sonner'
import { ToastProvider } from '@/lib/toast-context'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { CelebrationProvider } from '@/lib/celebration-context'
import {
  isExtensionRelatedErrorEvent,
  isExtensionRelatedReason
} from '@/lib/browser-extension-guard'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __extensionErrorGuarded?: boolean
  }
}

if (typeof window !== 'undefined' && !window.__extensionErrorGuarded) {
  const handleError = (event: ErrorEvent) => {
    if (isExtensionRelatedErrorEvent(event)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      console.warn('Ignored browser extension runtime error:', event.error?.message ?? event.message)
    }
  }

  const handleRejection = (event: PromiseRejectionEvent) => {
    const { reason } = event
    if (isExtensionRelatedReason(reason)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      console.warn('Ignored browser extension promise rejection:', reason)
    }
  }

  window.addEventListener('error', handleError, { capture: true })
  window.addEventListener('unhandledrejection', handleRejection, { capture: true })
  window.__extensionErrorGuarded = true
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <Provider>
        <ToastProvider>
          <CelebrationProvider>
            <div className="relative flex min-h-screen flex-col bg-background overflow-hidden">
              <div className="global-background" aria-hidden="true" />
              <div className="premium-aurora-bg" aria-hidden="true" />
              <CmsBanner />
              <SimpleNavbar />

              <ErrorBoundary>
                <main id="main-content" className="flex-1 w-full theme-normalize" role="main" aria-label="Main content">
                  {children}
                </main>
              </ErrorBoundary>
              <CmsFooter />
              <FloatingCTA />
              <Toaster
                richColors
                position="top-center"
                toastOptions={{
                  style: {
                    borderRadius: '0.5rem',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))'
                  }
                }}
              />
              <ToastContainer />
            </div>
          </CelebrationProvider>
        </ToastProvider>
      </Provider>
    </SessionProvider>
  )
}
