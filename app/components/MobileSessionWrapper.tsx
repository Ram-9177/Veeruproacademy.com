'use client'

import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth-utils'

interface MobileSessionWrapperProps {
  onClose: () => void
}

export default function MobileSessionWrapper({ onClose }: MobileSessionWrapperProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-full h-12 bg-white/10 rounded-lg animate-pulse" />
  }

  if (!session?.user) {
    return (
      <>
        <Link href="/login" className="btn btn-secondary" onClick={onClose}>
          <User className="w-4 h-4" />
          Login
        </Link>
        <Link href="/courses" className="btn btn-primary" onClick={onClose}>
          Get Started
        </Link>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
          {session.user.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{session.user.name}</p>
          <p className="text-white/60 text-xs">{session.user.email}</p>
        </div>
      </div>
      <Link href="/dashboard" className="btn btn-secondary" onClick={onClose}>
        <User className="w-4 h-4" />
        Dashboard
      </Link>
      {isAdmin((session.user as any).roles || []) && (
        <Link href="/admin/hub" className="btn btn-secondary" onClick={onClose}>
          <Settings className="w-4 h-4" />
          Admin Panel
        </Link>
      )}
      <button
        onClick={() => {
          onClose()
          signOut({ callbackUrl: '/' })
        }}
        className="btn btn-secondary text-red-400 hover:text-red-300"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </>
  )
}