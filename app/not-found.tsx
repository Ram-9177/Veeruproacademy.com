import Link from 'next/link'
import { Home, BookOpen } from 'lucide-react'
import { AttractiveBackground } from './components/AttractiveBackground'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* 404 Animation */}
          <div className="relative">
            <div className="text-9xl font-bold text-blue-500 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-9xl font-bold text-blue-500/20 blur-sm">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#ffffff' }}>
              Page Not Found
            </h1>
            <p className="text-xl" style={{ color: '#a1a1aa' }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/" className="btn btn-primary btn-lg group">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link href="/courses" className="btn btn-secondary btn-lg group">
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-12 border-t border-white/10">
            <p className="text-sm mb-6" style={{ color: '#a1a1aa' }}>
              Or try one of these popular pages:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Courses', href: '/courses', icon: '📚' },
                { name: 'Projects', href: '/projects', icon: '🚀' },
                { name: 'Tutorials', href: '/tutorials', icon: '📖' },
                { name: 'About', href: '/about', icon: '👋' }
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="p-4 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium group-hover:text-blue-400 transition-colors" style={{ color: '#ffffff' }}>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}