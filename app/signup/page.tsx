"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Loader2, ShieldCheck, User, Mail, Lock, UserPlus, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      return false
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (!formData.password) {
      setError('Please enter a password')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create account')
        setIsLoading(false)
        return
      }

      setSuccess('Account created successfully! Redirecting to login...')
      
      setTimeout(() => {
        router.push('/login?message=Account created successfully. Please sign in.')
      }, 2000)
      
    } catch (err) {
      console.error('Signup error:', err)
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
            <UserPlus className="w-4 h-4" />
            Create Account
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join VeeruPro Academy
          </h1>
          <p className="text-xl text-white/90">
            Start your learning journey today
          </p>
        </div>
      </section>

      {/* Signup Form - W3Schools Style */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-md mx-auto">
            <div className="w3-card p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
                <p className="text-sm text-gray-400">
                  Fill in your details to get started
                </p>
              </div>

              {error && (
                <div className="alert alert-error mb-6 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-6">{error}</p>
                </div>
              )}

              {success && (
                <div className="alert alert-success mb-6 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-6">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading || !!success}
                      className="form-control pl-10 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading || !!success}
                      className="form-control pl-10 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Create a password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading || !!success}
                      className="form-control pl-10 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading || !!success}
                      className="form-control pl-10 disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!success}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </span>
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Account Created!
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    Secure Registration
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    Encrypted Data
                  </div>
                </div>
                
                <p className="text-sm text-center text-gray-400">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Sign in here
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
