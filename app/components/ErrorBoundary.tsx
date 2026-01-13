'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { isExtensionError } from '@/lib/browser-extension-guard'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if error is from browser extension
    if (isExtensionError(error)) {
      console.warn('Browser extension error detected, ignoring:', error.message)
      return { hasError: false }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Check if error is from browser extension
    if (isExtensionError(error)) {
      console.warn('Browser extension error caught and ignored:', error.message)
      return
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Something went wrong</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                icon={<RefreshCw className="h-4 w-4" />}
                className="w-full"
              >
                Refresh Page
              </Button>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Show Error Details
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error
  resetError: () => void 
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
          <p className="text-sm text-muted-foreground">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>
        
        <Button onClick={resetError} size="sm" className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  )
}