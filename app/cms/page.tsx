import Link from 'next/link'
import { FileText, ImageUp, Video, Settings, Users, BarChart3, ArrowRight } from 'lucide-react'
import { AttractiveBackground } from '../components/AttractiveBackground'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export default async function CMSPage() {
  await requireAdmin()

  const [
    activeCourses,
    publishedLessons,
    projectsCount,
    usersCount
  ] = await Promise.all([
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.lesson.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.count({ where: { status: 'ACTIVE' } })
  ])

  const cmsModules = [
    {
      title: 'Content Management',
      description: 'Create and manage lessons, tutorials, and pages',
      icon: FileText,
      href: '/admin/content',
      color: 'bg-blue-600'
    },
    {
      title: 'Course Management',
      description: 'Create and edit courses and curriculum',
      icon: Video,
      href: '/admin/courses',
      color: 'bg-purple-600'
    },
    {
      title: 'Project Management',
      description: 'Manage hands-on projects and assignments',
      icon: Users,
      href: '/admin/projects',
      color: 'bg-emerald-600'
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-pink-600'
    },
    {
      title: 'Analytics',
      description: 'View performance metrics and reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-indigo-600'
    },
    {
      title: 'Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-600'
    }
  ]

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 rounded-full text-lg font-bold mb-8 backdrop-blur-sm border border-white/30">
              <span className="text-3xl">🎓</span>
              Educational Content Management System
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white">
              Learning CMS Hub
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-white/95 mb-6">
              Empower Education Through Technology
            </p>
            <p className="text-xl text-white/85 mb-12 leading-relaxed max-w-4xl mx-auto">
              Complete control over your educational platform. Create engaging courses, manage student progress, 
              and deliver exceptional learning experiences with our comprehensive content management system.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Live Platform
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Real-time Updates
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                Advanced Analytics
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-blue-500/20 rounded-3xl p-6 border border-blue-500/30 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{activeCourses}</div>
            <div className="text-blue-200 font-semibold">Active Courses</div>
          </div>
          <div className="bg-emerald-500/20 rounded-3xl p-6 border border-emerald-500/30 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📖</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{publishedLessons}</div>
            <div className="text-emerald-200 font-semibold">Published Lessons</div>
          </div>
          <div className="bg-purple-500/20 rounded-3xl p-6 border border-purple-500/30 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{projectsCount}</div>
            <div className="text-purple-200 font-semibold">Student Projects</div>
          </div>
          <div className="bg-pink-500/20 rounded-3xl p-6 border border-pink-500/30 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-pink-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{usersCount}</div>
            <div className="text-pink-200 font-semibold">Active Students</div>
          </div>
        </div>

        {/* CMS Modules */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">CMS Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cmsModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 group hover:scale-105"
              >
                <div className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <module.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-white/60 mb-4 leading-relaxed">
                  {module.description}
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  Access Module
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/courses/new"
              className="flex items-center gap-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors group"
            >
              <Video className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-white group-hover:text-blue-300">New Course</span>
            </Link>
            <Link
              href="/admin/content/new"
              className="flex items-center gap-3 p-4 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-colors group"
            >
              <FileText className="w-6 h-6 text-emerald-400" />
              <span className="font-semibold text-white group-hover:text-emerald-300">New Page</span>
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center gap-3 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-colors group"
            >
              <ImageUp className="w-6 h-6 text-purple-400" />
              <span className="font-semibold text-white group-hover:text-purple-300">Upload Media</span>
            </Link>
            <Link
              href="/admin/users/new"
              className="flex items-center gap-3 p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl transition-colors group"
            >
              <Users className="w-6 h-6 text-orange-400" />
              <span className="font-semibold text-white group-hover:text-orange-300">Add User</span>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-600 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Need Help?</h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Check out our documentation or contact support for assistance with managing your content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/help"
              className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg rounded-xl transition-colors"
            >
              View Documentation
            </Link>
            <Link
              href="/admin/hub"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold text-lg rounded-xl transition-colors"
            >
              Back to Admin Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
