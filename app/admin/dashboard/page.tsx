import { requireAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'
import { DashboardStats } from './components/DashboardStats'
import { RecentActivity } from './components/RecentActivity'
import { TopContent } from './components/TopContent'


export const dynamic = 'force-dynamic'
export default async function AdminDashboardPage() {
  const session = await requireAdmin()

  let courses = 0
  let lessons = 0
  let projects = 0
  let users = 0
  let recentLogs: Array<any> = []
  let topCourses: Array<any> = []

  try {
    // Get stats (gracefully handle missing DB)
    const results = await Promise.all([
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.project.count(),
      prisma.user.count(),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      })
    ])
    ;[courses, lessons, projects, users, recentLogs] = results as [number, number, number, number, any[]]

    topCourses = await prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { status: 'PUBLISHED' }
    })
  } catch (e) {
    // Fallback demo stats when DB is not configured
    courses = 0
    lessons = 0
    projects = 0
    users = 0
    recentLogs = []
    topCourses = []
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-foreground">Dashboard</h1>
        <p className="text-lg text-secondary-3">Welcome back, {session?.user?.name || 'Admin'}</p>
      </div>

      <DashboardStats 
        courses={courses}
        lessons={lessons}
        projects={projects}
        users={users}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="group h-full">
          {recentLogs.length === 0 ? (
            <div className="p-8 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md h-full flex items-center justify-center">
              <p className="text-sm text-secondary-3 text-center">
                No recent activity yet. Configure your database to start recording admin actions.
              </p>
            </div>
          ) : (
            <RecentActivity logs={recentLogs} />
          )}
        </div>
        <div className="group h-full">
          {topCourses.length === 0 ? (
            <div className="p-8 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md h-full flex items-center justify-center">
              <p className="text-sm text-secondary-3 text-center">
                No courses to display. Once the CMS is connected to your database, published courses will appear here.
              </p>
            </div>
          ) : (
            <TopContent courses={topCourses} />
          )}
        </div>
      </div>
    </div>
  )
}

