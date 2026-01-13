'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowRight, Home, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function RedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const [error, setError] = useState<string | null>(null)

  // Get redirect parameters
  const to = searchParams?.get('to')
  const message = searchParams?.get('message')
  const delay = parseInt(searchParams?.get('delay') || '3000')
  const auto = searchParams?.get('auto') !== 'false' // Default to true

  useEffect(() => {
    if (!to) {
      setError('No redirect destination specified')
      return
    }

    // Validate redirect URL (security check)
    const isValidRedirect = (url: string) => {
      try {
        // Allow relative URLs and same-origin URLs
        if (url.startsWith('/')) return true
        
        const urlObj = new URL(url, window.location.origin)
        return urlObj.origin === window.location.origin
      } catch {
        return false
      }
    }

    if (!isValidRedirect(to)) {
      setError('Invalid redirect destination')
      return
    }

    if (auto) {
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            router.push(to)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Redirect after delay
      const redirectTimeout = setTimeout(() => {
        router.push(to)
      }, delay)

      return () => {
        clearInterval(countdownInterval)
        clearTimeout(redirectTimeout)
      }
    }
  }, [to, delay, auto, router])

  const handleManualRedirect = () => {
    if (to) {
      router.push(to)
    }
  }

  const getDestinationName = (url: string) => {
    if (url.startsWith('/admin')) return 'Admin Panel'
    if (url.startsWith('/dashboard')) return 'Dashboard'
    if (url.startsWith('/courses')) return 'Courses'
    if (url.startsWith('/projects')) return 'Projects'
    if (url.startsWith('/login')) return 'Login'
    if (url === '/') return 'Home'
    return 'Destination'
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Redirect Error</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl p-8 text-center">
          {/* Loading Animation */}
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            {message || 'Redirecting...'}
          </h1>

          {/* Destination Info */}
          {to && (
            <div className="mb-6">
              <p className="text-gray-400 mb-2">Taking you to:</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <span className="text-white font-medium">{getDestinationName(to)}</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          )}

          {/* Countdown */}
          {auto && countdown > 0 && (
            <div className="mb-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">{countdown}</div>
              <p className="text-gray-400 text-sm">seconds remaining</p>
            </div>
          )}

          {/* Manual Actions */}
          <div className="flex flex-col gap-3">
            {to && (
              <button
                onClick={handleManualRedirect}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                <span>Continue Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium border border-white/20"
            >
              <Home className="w-4 h-4" />
              Go Home Instead
            </Link>
          </div>

          {/* Progress Bar */}
          {auto && countdown > 0 && (
            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}