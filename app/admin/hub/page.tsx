import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  BookOpen,
  FileArchive,
  Users,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Activity
} from 'lucide-react'
import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { RealtimeStatus } from '@/components/RealtimeStatus'


export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getAdminStats() {
  try {
    const [totalCourses, totalUsers, totalProjects, totalLessons] = await Promise.all([
      prisma.course.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.project.count().catch(() => 0),
      prisma.lesson.count().catch(() => 0)
    ])
    return { totalCourses, totalUsers, totalProjects, totalLessons }
  } catch (error) {
    console.error('[AdminHub] Error fetching stats:', error)
    return { totalCourses: 0, totalUsers: 0, totalProjects: 0, totalLessons: 0 }
  }
}

async function getRecentActivity() {
  try {
    const [recentCourses, recentUsers, recentProjects] = await Promise.all([
      prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { title: true, createdAt: true }
      }).catch(() => []),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { email: true, createdAt: true }
      }).catch(() => []),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { title: true, createdAt: true }
      }).catch(() => [])
    ])
    return { recentCourses, recentUsers, recentProjects }
  } catch (error) {
    console.error('[AdminHub] Error fetching recent activity:', error)
    return { recentCourses: [], recentUsers: [], recentProjects: [] }
  }
}

export default async function AdminHubPage() {
  try {
    await requireAdmin()
  } catch (error) {
    console.warn('Admin hub auth failed, redirecting to login', error)
    redirect('/admin/login?callbackUrl=/admin/hub')
  }

  // Fetch real stats from database with error handling
  const { totalCourses, totalUsers, totalProjects, totalLessons } = await getAdminStats()

  const stats = [
    { label: 'Total Courses', value: totalCourses.toString(), icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { label: 'Active Users', value: totalUsers.toString(), icon: Users, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Projects', value: totalProjects.toString(), icon: FileArchive, color: 'from-purple-500 to-purple-600' },
    { label: 'Lessons', value: totalLessons.toString(), icon: FileText, color: 'from-orange-500 to-orange-600' }
  ]

  const quickActions = [
    { 
      title: 'Realtime Monitor', 
      href: '/admin/realtime', 
      desc: 'Live activity dashboard',
      icon: Activity,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    { 
      title: 'Create Course', 
      href: '/admin/courses/new', 
      desc: 'Start a new course',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    { 
      title: 'New Content', 
      href: '/admin/content/new', 
      desc: 'Create lessons & tutorials',
      icon: FileText,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
    },
    { 
      title: 'Add Project', 
      href: '/admin/projects/new', 
      desc: 'Create hands-on projects',
      icon: FileArchive,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    }
  ]

  // Fetch recent activity data with error handling
  const { recentCourses, recentUsers, recentProjects } = await getRecentActivity()

  // Combine and format activity
  const recentActivity = [
    ...recentCourses.map(c => ({
      action: 'New course created',
      item: c.title,
      time: new Date(c.createdAt).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      timestamp: c.createdAt.getTime()
    })),
    ...recentUsers.map(u => ({
      action: 'User registered',
      item: u.email || 'Unknown User',
      time: new Date(u.createdAt).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      timestamp: u.createdAt.getTime()
    })),
    ...recentProjects.map(p => ({
      action: 'Project created',
      item: p.title,
      time: new Date(p.createdAt).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      timestamp: p.createdAt.getTime()
    }))
  ]
  .sort((a, b) => b.timestamp - a.timestamp)
  .slice(0, 5) // Take top 5 most recent across all categories

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Header */}
      <div className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <LayoutDashboard className="w-4 h-4" />
            Admin Panel
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/90">
            Manage Your Platform
          </p>
        </div>
      </div>

      <div className="w3-container py-12 space-y-10">
        {/* Realtime Status */}
        <div className="flex justify-end">
          <RealtimeStatus />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="w3-card">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} flex items-center justify-center rounded-xl`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="w3-card hover:border-blue-500 transition-all duration-300 text-center group"
                >
                  <div className={`w-14 h-14 ${action.color} flex items-center justify-center mb-5 rounded-xl mx-auto group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{action.title}</h3>
                  <p className="text-sm text-gray-400">{action.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 w3-card">
            <div className="p-6 bg-gray-700 border-b border-gray-600">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-6 border-b last:border-0 last:pb-0 border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold mb-1 text-white">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.item}</p>
                      </div>
                      <span className="text-xs px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30 w-fit">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w3-card">
            <div className="p-6 bg-gray-700 border-b border-gray-600">
              <h2 className="text-xl font-bold text-white">Quick Links</h2>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <Link href="/admin/courses" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Manage Courses</span>
                </Link>
                <Link href="/admin/content" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-white text-lg">📝</span>
                  </div>
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Manage Content</span>
                </Link>
                <Link href="/admin/projects" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-white text-lg">🚀</span>
                  </div>
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Manage Projects</span>
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-white text-lg">👥</span>
                  </div>
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Manage Users</span>
                </Link>
                <Link href="/admin/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">View Analytics</span>
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group">
                  <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <span className="text-white text-lg">⚙️</span>
                  </div>
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="w3-section bg-blue-600">
          <div className="w3-container text-center text-white">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl mx-auto mb-5">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
            <p className="text-lg text-white/80 mb-6 leading-relaxed max-w-2xl mx-auto">
              Check out our documentation or contact support for assistance with managing your platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin-help" className="btn btn-outline">
                Documentation
              </Link>
              <Link href="/cms" className="btn btn-secondary">
                Open CMS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
