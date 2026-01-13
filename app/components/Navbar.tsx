'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Search, BookOpen, Code } from 'lucide-react'
import { VeeruProLogo } from './VeeruProLogo'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Tutorials', href: '/tutorials' },
  { name: 'Contact', href: '/contact' },
]

interface NavbarCourse {
  id: string
  slug: string
  title: string
  icon: string
  order: number
  visible: boolean
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [coursesData, setCoursesData] = useState<NavbarCourse[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchNavbarCourses()
  }, [])

  const fetchNavbarCourses = async () => {
    try {
      const response = await fetch('/api/navbar-courses')
      if (response.ok) {
        const data = await response.json()
        setCoursesData(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch navbar courses:', error)
      setCoursesData([
        { id: '1', slug: 'free-intro-to-coding', title: 'Introduction to Coding', icon: '🎯', order: 0, visible: true },
        { id: '2', slug: 'nextjs-fullstack', title: 'Full-Stack Next.js Studio', icon: '▲', order: 1, visible: true },
        { id: '3', slug: 'intro-to-python', title: 'Python for Problem Solving', icon: '🐍', order: 2, visible: true }
      ])
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl group">
            <VeeruProLogo 
              width={36} 
              height={36} 
              className="transition-transform duration-300 group-hover:scale-110" 
            />
            <span className="group-hover:text-blue-400 transition-colors duration-300 hidden sm:block">
              Veeru&apos;s Pro Academy
            </span>
            <span className="group-hover:text-blue-400 transition-colors duration-300 sm:hidden">
              Veeru&apos;s Pro
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
              Courses
            </Link>
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Login
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-blue-400 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {showSearch && (
          <div className="hidden md:block py-4 border-t border-white/10">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {isOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="flex flex-col gap-4">
              <Link href="/courses" className="text-white/80 hover:text-white transition-colors duration-200 font-medium py-2" onClick={() => setIsOpen(false)}>
                Courses
              </Link>
              
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-white/80 hover:text-white transition-colors duration-200 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors block text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Courses Line Below Navbar - Desktop Only */}
        <div className="hidden md:block border-t border-white/10 py-4 bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-3 text-sm font-bold text-white/90 flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-base">🎓 Featured Courses</span>
              </div>
              <div className="flex items-center gap-4">
                {coursesData.slice(0, 6).map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-blue-600/20 text-white/90 hover:text-white transition-all duration-300 text-sm font-semibold whitespace-nowrap group border border-white/20 hover:border-blue-400/50 hover:shadow-xl backdrop-blur-sm min-w-fit transform hover:scale-105"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">{course.icon}</span>
                    <span className="font-bold tracking-wide">{course.title}</span>
                  </Link>
                ))}
                <Link
                  href="/courses"
                  className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 text-sm font-bold whitespace-nowrap shadow-xl hover:shadow-2xl hover:scale-110 border border-orange-400/50 transform"
                >
                  <span>🚀 Explore All</span>
                  <Code className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}