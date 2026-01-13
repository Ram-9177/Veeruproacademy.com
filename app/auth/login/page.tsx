'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main login page
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-2xl">🔄</span>
        </div>
        <p className="text-lg font-medium" style={{ color: '#ffffff' }}>Redirecting to login...</p>
      </div>
    </div>
  )
}