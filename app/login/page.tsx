'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { AlertCircle, Loader2, ShieldCheck, User, Lock, LogIn, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirectScenarios as _redirectScenarios } from '@/lib/redirect-utils'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams?.get('message')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const formatAuthError = (code: string) => {
    // NextAuth commonly returns short error codes.
    switch (code) {
      case 'Configuration':
        return 'Login is temporarily unavailable due to a server configuration issue. Please try again later.'
      case 'CredentialsSignin':
        return 'Invalid email or password'
      case 'AccessDenied':
        return 'Access denied. Please contact support if you think this is a mistake.'
      default:
        return code || 'Invalid email or password'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        redirect: false
      })

      if (!result) {
        setError('Login failed. Please try again.')
        setIsLoading(false)
        return
      }

      if (result.error) {
        setError(formatAuthError(result.error))
        setIsLoading(false)
        return
      }

      if (result.ok) {
        // Fetch session to get user roles
        const sessionResponse = await fetch('/api/auth/session')
        const session = await sessionResponse.json()
        
        // Determine redirect based on user role
        let redirectUrl = '/dashboard' // Default for students
        
        if (session?.user?.roles) {
          const roles = session.user.roles
          
          // Admin users go to admin hub
          if (roles.includes('ADMIN')) {
            redirectUrl = '/admin/hub'
          }
          // Mentor users could also go to dashboard or a mentor-specific page
          else if (roles.includes('MENTOR')) {
            redirectUrl = '/dashboard'
          }
        }
        
        // Successful login - redirect to appropriate page
        window.location.href = redirectUrl
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900">{/* Same theme as home page */}
      {/* Hero Section - W3Schools Style */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <User className="w-4 h-4" />
            Student Login
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome Back
          </h1>
          <p className="text-xl text-white/90">
            Continue your learning journey
          </p>
        </div>
      </section>

      {/* Login Form - W3Schools Style */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-md mx-auto">
            <div className="w3-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-sm text-gray-400">
                  Enter your credentials to access your account
                </p>
              </div>

              {message && (
                <div className="alert alert-success mb-6 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-6">{message}</p>
                </div>
              )}

              {error && (
                <div className="alert alert-error mb-6 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-6">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="form-control disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="form-control disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    Secure Login
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    Encrypted
                  </div>
                </div>
                
                <p className="text-sm text-center text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Sign up here
                  </Link>
                </p>
                <p className="text-sm mt-2 text-center text-gray-400">
                  Admin access?{' '}
                  <Link href="/admin/login" className="font-semibold text-green-400 hover:text-green-300 transition-colors">
                    Admin Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
