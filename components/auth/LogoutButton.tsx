"use client"

import { signOut } from 'next-auth/react'
import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
}

export function LogoutButton({ 
  variant = 'default', 
  size = 'md',
  className = '',
  showIcon = true 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      })
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200"
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }

  const variantStyles = {
    default: "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
    outline: "border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950",
    ghost: "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          {showIcon && <LogOut className="w-4 h-4" />}
          <span>Logout</span>
        </>
      )}
    </button>
  )
}

// Compact logout button for headers/nav
export function LogoutIconButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      })
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors disabled:opacity-50"
      title="Logout"
      aria-label="Logout"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </button>
  )
}
