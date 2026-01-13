'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, BookOpen, Search, Bell, Code, Palette, Brain, BarChart3 } from 'lucide-react'
import { VeeruProLogo } from './VeeruProLogo'

interface NavbarCourse {
  title: string
  shortTitle?: string
  slug: string
  language?: string
  icon?: string
  price?: number
  visible?: boolean
}

import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, Settings } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Contact', href: '/contact' },
]

// Professional course icons mapping
const getCourseIcon = (language: string, iconStr?: string) => {
  if (iconStr && iconStr.length < 5) return <span className="text-base leading-none">{iconStr}</span>
  
  switch (language) {
    case 'JavaScript':
      return <Code className="w-4 h-4 text-yellow-400" />
    case 'Python':
      return <Code className="w-4 h-4 text-green-400" />
    case 'TypeScript':
      return <Code className="w-4 h-4 text-blue-400" />
    case 'UI/UX':
      return <Palette className="w-4 h-4 text-purple-400" />
    case 'Data':
      return <BarChart3 className="w-4 h-4 text-orange-400" />
    case 'AI':
      return <Brain className="w-4 h-4 text-pink-400" />
    default:
      return <BookOpen className="w-4 h-4 text-blue-400" />
  }
}

export function SimpleNavbar() {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')
  const [isOpen, setIsOpen] = useState(false)
  const [courses, setCourses] = useState<NavbarCourse[]>([])
  
  const { data: session, status } = useSession()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  // Search & Notification States
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }
  
  // Format time helper
  const timeAgo = (dateStr: string) => {
     const date = new Date(dateStr)
     const now = new Date()
     const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
     
     if (seconds < 60) return 'Just now'
     const minutes = Math.floor(seconds / 60)
     if (minutes < 60) return `${minutes}m ago`
     const hours = Math.floor(minutes / 60)
     if (hours < 24) return `${hours}h ago`
     return date.toLocaleDateString()
  }

  // Fetch notifications
  useEffect(() => {
    if (!isAdminPath && status === 'authenticated') {
      const fetchNotifications = async () => {
        try {
          const res = await fetch('/api/user/notifications')
          if (res.ok) {
            const data = await res.json()
            setNotifications(data.map((n: any) => ({
              id: n.id,
              title: n.title,
              message: n.message || '',
              time: timeAgo(n.createdAt),
              read: n.read
            })))
          }
        } catch (error) {
          console.error('Failed to fetch notifications', error)
        }
      }
      fetchNotifications()
    }
  }, [status, isAdminPath])

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/user/notifications', { method: 'PUT', body: JSON.stringify({}) })
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({...n, read: true})))
      }
    } catch (error) {
      console.error('Failed to mark notifications read', error)
    }
  }

  useEffect(() => {
    async function fetchCourses() {
      if (isAdminPath) return
      try {
        const res = await fetch('/api/navbar-courses')
        if (res.ok) {
          const data = await res.json()
          setCourses(data.courses || [])
        }
      } catch (err) {
        console.error('Failed to fetch navbar courses', err)
      }
    }
    fetchCourses()
  }, [isAdminPath])

  // Admin has its own chrome (sidebar/header). Keep public navbar off admin routes.
  if (isAdminPath) {
    return null
  }

  return (
    <nav className="w3-navbar-modern">
      <div className="container mx-auto">
        {/* Main Navigation Bar */}
        <div className="navbar-main">
          {/* Logo Section - Mobile Responsive */}
          <Link href="/" className="navbar-logo">
            <VeeruProLogo 
              width={50} 
              height={50}
              className="" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="navbar-item"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4 relative">
            
            {/* Search Container */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex items-center animate-in fade-in slide-in-from-right-4 duration-200 z-50">
                  <form onSubmit={handleSearch} className="flex w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses..."
                      className="w-full px-4 py-2 text-sm focus:outline-none bg-transparent dark:text-gray-200"
                      autoFocus
                    />
                    <button 
                      type="button" 
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="navbar-icon-btn hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Notifications Container */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen)
                  setIsSearchOpen(false)
                }}
                className="navbar-icon-btn hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <p className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${!notification.read ? 'text-blue-600' : ''}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center">
                    <Link href="/notifications" className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* Notifications Container */}
            
            {status === 'authenticated' && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md border-2 border-white/10">
                    {session.user.name ? (
                      session.user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {session.user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/my-courses"
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        My Learning
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="btn-navbar-outline"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-navbar-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden navbar-mobile-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden navbar-mobile">
            <div className="mobile-menu">
              {navigation.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="mobile-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mobile-actions">
                <Link
                  href="/login"
                  className="btn-mobile-outline"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-mobile-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Courses Navigation Bar - Mobile Responsive */}
        <div className="courses-navbar">
          <div className="courses-nav-content">
            <div className="courses-label">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-gray-400 hidden sm:inline">Featured Courses</span>
              <span className="font-medium text-gray-400 sm:hidden">Courses</span>
            </div>
            
            <div className="courses-list">
              {courses.slice(0, 5).map((course) => (
                <Link
                  key={course.slug}
                  href={`/courses/${course.slug}`}
                  className="course-nav-item"
                >
                  <span className="course-icon">
                    {getCourseIcon(course.language || '', course.icon)}
                  </span>
                  <span className="course-title whitespace-nowrap">
                    {course.shortTitle || course.title}
                  </span>
                  {(!course.price || course.price === 0) && (
                    <span className="course-free-badge">FREE</span>
                  )}
                </Link>
              ))}
              
              <Link
                href="/courses"
                className="view-all-courses"
              >
                <span>View All →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
