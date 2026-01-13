'use client'

import type { ComponentType } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  FileArchive,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Upload,
  Users,
  Home,
  GraduationCap,
  Activity
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { VeeruProLogo } from '@/app/components/VeeruProLogo'
import { sanitize } from '@/lib/security'

type RoleKey = 'ADMIN' | 'MENTOR' | 'STUDENT'

interface AdminSidebarProps {
  userRoles: RoleKey[]
  primaryRole?: RoleKey
  isMobile?: boolean
}

type NavItem = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  roles: RoleKey[]
}

const navItems: NavItem[] = [
  { href: '/admin/hub', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
  { href: '/admin/realtime', label: 'Realtime Monitor', icon: Activity, roles: ['ADMIN'] },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, roles: ['ADMIN'] },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap, roles: ['ADMIN', 'MENTOR'] },
  { href: '/admin/lessons', label: 'Lessons', icon: FileText, roles: ['ADMIN', 'MENTOR'] },
  { href: '/admin/projects', label: 'Projects', icon: FileArchive, roles: ['ADMIN', 'MENTOR'] },
  { href: '/admin/navbar', label: 'Navbar Courses', icon: Home, roles: ['ADMIN'] },
  { href: '/admin/media', label: 'Media', icon: Upload, roles: ['ADMIN', 'MENTOR'] },
  { href: '/admin/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare, roles: ['ADMIN', 'MENTOR'] },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle, roles: ['ADMIN', 'MENTOR'] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, roles: ['ADMIN'] },
  { href: '/admin/audit', label: 'Audit Logs', icon: Shield, roles: ['ADMIN'] }
]

function userHasRole(roles: RoleKey[], allowed: RoleKey[]) {
  return allowed.some((role) => roles.includes(role))
}

export function AdminSidebar({ userRoles, primaryRole, isMobile = false }: AdminSidebarProps) {
  const pathname = usePathname()
  
  // Sanitize and validate user roles
  const sanitizedUserRoles = Array.isArray(userRoles) 
    ? userRoles.filter(role => ['ADMIN', 'MENTOR', 'STUDENT'].includes(role))
    : []
  
  const sanitizedPrimaryRole = primaryRole && ['ADMIN', 'MENTOR', 'STUDENT'].includes(primaryRole) 
    ? primaryRole 
    : 'ADMIN'
  
  const effectiveRoles = sanitizedUserRoles.length > 0 ? sanitizedUserRoles : [sanitizedPrimaryRole]

  // Filter navigation items based on user roles
  const visibleItems = navItems.filter((item) => userHasRole(effectiveRoles, item.roles))

  const closeMobileSidebar = () => {
    if (isMobile) {
      const overlay = document.getElementById('mobile-sidebar-overlay')
      if (overlay) {
        overlay.classList.add('hidden')
      }
    }
  }

  // Validate pathname to prevent XSS
  const sanitizedPathname = sanitize.string(pathname || '')

  return (
    <aside className={cn(
      "w-64 flex flex-col h-screen bg-gray-800 border-r border-gray-700 shadow-lg",
      isMobile && "relative z-50"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link href="/admin/hub" className="flex items-center gap-3" onClick={closeMobileSidebar}>
          <div className="p-2 bg-blue-600 rounded-xl">
            <VeeruProLogo 
              width={28} 
              height={28} 
              showText={false}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Veeru&apos;s Pro</h1>
            <p className="text-xs font-medium text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* View Website Button */}
      <div className="p-4 border-b border-gray-700">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors rounded-xl"
          onClick={closeMobileSidebar}
        >
          <Home className="w-5 h-5" />
          <span>View Website</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" role="navigation" aria-label="Admin navigation">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = sanitizedPathname === item.href || sanitizedPathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobileSidebar}
              className={cn(
                'flex items-center gap-4 px-4 py-3 mb-2 transition-colors rounded-xl',
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                'w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
                isActive 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-gray-700 text-gray-400'
              )}>
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium">{sanitize.string(item.label)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <div className="text-center space-y-3">
          <div className="text-xs font-medium text-gray-400">
            © 2025 VeeruPro Academy
          </div>
          <Link 
            href="/admin-help" 
            onClick={closeMobileSidebar}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-blue-400 font-semibold text-xs rounded-xl transition-colors" 
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & Docs</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
