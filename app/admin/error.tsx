'use client'

/**
 * Error boundary for /app/admin pages
 * 
 * Catches errors in admin dashboard and displays a recovery interface.
 */

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log admin errors for monitoring
    logger.error('Admin page error', error, {
      digest: error.digest,
      path: '/admin'
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Error in Admin Panel</h1>
          <p className="mt-2 text-gray-600">
            Something went wrong. Our team has been notified.
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-700 font-mono break-words">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-orange-600 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <a
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Dashboard
          </a>
        </div>

        <details className="text-left">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
            Error Details (Development)
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            {error.stack}
          </pre>
        </details>
      </div>
    </div>
  )
}
