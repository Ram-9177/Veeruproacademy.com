'use client'

/**
 * Error boundary for /app/courses pages
 * 
 * Catches errors in child components and displays a user-friendly error page
 * instead of crashing the entire application.
 */

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CoursesErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error for debugging
    logger.error('Courses page error', error, {
      digest: error.digest,
      path: '/courses'
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Oops!</h1>
          <p className="mt-2 text-gray-600">
            Something went wrong while loading the courses.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-red-600 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go Home
          </a>
        </div>

        <p className="text-xs text-gray-500">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}
