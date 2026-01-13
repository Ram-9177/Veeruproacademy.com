'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const _router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const mapError = (err: string | null) => {
    if (!err) return null
    if (err.includes('Invalid')) return 'Invalid email or password. Please check your credentials.'
    if (err.includes('Unauthorized')) return 'You do not have admin access. Contact your administrator.'
    if (err.includes('not configured')) return 'Authentication service is not properly configured. Please try again later.'
    return 'Login failed. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        redirect: false,
        callbackUrl: '/admin/hub'
      })

      if (!result) {
        setError('Login failed. Please try again.')
        setIsLoading(false)
        return
      }

      if (result.error) {
        setError(mapError(result.error))
        setIsLoading(false)
        return
      }

      if (result.ok) {
        // Fetch session to verify admin role
        const sessionResponse = await fetch('/api/auth/session')
        const session = await sessionResponse.json()
        
        // Check if user has admin role
        if (session?.user?.roles && session.user.roles.includes('ADMIN')) {
          setSuccessMessage('Authentication successful, redirecting to admin dashboard...')
          setTimeout(() => {
            window.location.href = '/admin/hub'
          }, 500)
        } else {
          setError('You do not have admin access. Please use the student login.')
          setIsLoading(false)
        }
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const urlError = searchParams.get('error')
  const displayError = error || (urlError ? mapError(urlError) : null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-sm text-slate-400">Secure admin access to dashboard</p>
          </div>

          {/* Error/Success Messages */}
          {displayError && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" />
              <p className="text-sm text-red-300">{displayError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5 text-emerald-400" />
              <p className="text-sm text-emerald-300">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@veerupro.ac"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                Encrypted
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                Secure
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Admin Access Only • Role-Based Permissions
        </p>
      </div>
    </div>
  )
}
