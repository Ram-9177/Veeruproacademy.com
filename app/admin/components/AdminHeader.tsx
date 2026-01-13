'use client'

import { signOut } from 'next-auth/react'
import { LogOut, User, Settings, Bell, Search, Menu } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Image from 'next/image'
import { redirectScenarios } from '@/lib/redirect-utils'

type RoleKey = 'ADMIN' | 'MENTOR' | 'STUDENT'

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    roles?: RoleKey[]
    defaultRole?: RoleKey
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const primaryRole = user.roles?.[0] ?? user.defaultRole ?? 'ADMIN'
  const roleLabel = primaryRole.toLowerCase().replace(/_/g, ' ')
  const formattedRoleLabel = roleLabel.replace(/\b\w/g, (char) => char.toUpperCase())

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      window.location.href = redirectScenarios.afterLogout('You have been logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      window.location.href = redirectScenarios.afterLogout('Logged out')
    }
  }

  const toggleMobileSidebar = () => {
    const overlay = document.getElementById('mobile-sidebar-overlay')
    const backdrop = document.getElementById('mobile-sidebar-backdrop')
    
    if (overlay) {
      overlay.classList.toggle('hidden')
      
      // Close sidebar when backdrop is clicked
      if (backdrop) {
        backdrop.onclick = () => {
          overlay.classList.add('hidden')
        }
      }
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
        {/* Left: Mobile Menu + Logo/Brand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Logo Section - Fixed with Custom CSS */}
          <div className="admin-header-logo">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div className="admin-header-text">
              <div className="admin-header-title">Veeru&apos;s Pro</div>
              <div className="admin-header-subtitle">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Center: Search - Hidden on mobile */}
        <div className="flex-1 max-w-2xl hidden lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
            />
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mobile Search Button */}
          <button className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Search className="h-4 w-4" />
          </button>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors rounded-xl">
                <div className="text-right hidden xl:block">
                  <div className="text-sm font-semibold text-white">{user.name || 'Admin'}</div>
                  <div className="text-xs text-gray-400">{formattedRoleLabel}</div>
                </div>
                <div className="h-10 w-10 bg-blue-600 flex items-center justify-center rounded-xl">
                  {user.image ? (
                    <Image src={user.image} alt={user.name || ''} width={40} height={40} className="h-10 w-10 rounded-xl" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-gray-800 border border-gray-700 shadow-xl p-3 min-w-[220px] mt-2 rounded-xl">
                <div className="px-4 py-3 border-b border-gray-700 mb-3 bg-gray-700 rounded-xl">
                  <div className="text-sm font-semibold text-white">{user.name || 'Admin'}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <DropdownMenu.Item className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-3 text-sm outline-none rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Profile</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer flex items-center gap-3 text-sm outline-none rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Settings</span>
                </DropdownMenu.Item>
                <div className="h-px my-3 bg-gray-700" />
                <DropdownMenu.Item
                  onClick={handleSignOut}
                  className="px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 cursor-pointer flex items-center gap-3 text-sm outline-none rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  )
}
