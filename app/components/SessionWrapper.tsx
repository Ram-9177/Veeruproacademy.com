'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth-utils'
import { sanitize } from '@/lib/security'

export default function SessionWrapper() {
  const { data: session, status } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (status === 'loading') {
    return <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        Login
      </Link>
    )
  }

  // Sanitize user data to prevent XSS
  const sanitizedName = sanitize.string(session.user?.name || 'User')
  const sanitizedEmail = sanitize.string(session.user?.email || '')
  const userInitial = sanitizedName.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button 
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
          {userInitial}
        </div>
        <span className="text-white/80 text-sm hidden md:block">{sanitizedName}</span>
      </button>
      
      {showUserMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserMenu(false)}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50">
            <div className="p-3 border-b border-white/10">
              <p className="text-white font-medium text-sm truncate" title={sanitizedName}>
                {sanitizedName}
              </p>
              <p className="text-white/60 text-xs truncate" title={sanitizedEmail}>
                {sanitizedEmail}
              </p>
            </div>
            <div className="p-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                onClick={() => setShowUserMenu(false)}
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              {session.user && isAdmin((session.user as any).roles || []) && (
                <Link
                  href="/admin/hub"
                  className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}