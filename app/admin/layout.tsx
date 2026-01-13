import { getServerSession } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'
import { RealtimeUpdates } from '@/components/RealtimeUpdates'

type RoleKey = 'ADMIN' | 'MENTOR' | 'STUDENT'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the current session
  const session = await getServerSession()
  const user = session?.user ?? null

  // If no user, redirect to login (but allow /admin/login to render)
  // The middleware will handle redirecting unauthenticated users to /admin/login
  // This layout should not interfere with the login page
  if (!user) {
    // Return a minimal placeholder that allows the login page to render
    // The actual redirect is handled by middleware
    return <>{children}</>
  }

  // Check if user has admin role
  const userRoles = (user?.roles as RoleKey[] | undefined) ?? []
  const hasAdminRole = userRoles.includes('ADMIN')

  // If user doesn't have admin role, redirect to login with error
  if (!hasAdminRole) {
    redirect('/admin/login?error=Unauthorized')
  }

  const primaryRole = (user?.defaultRole as RoleKey | undefined) ?? userRoles[0] ?? 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen overflow-hidden bg-gray-900">
        {/* Mobile Sidebar Overlay - Hidden by default, shown when menu is open */}
        <div className="lg:hidden fixed inset-0 z-50 hidden" id="mobile-sidebar-overlay">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" id="mobile-sidebar-backdrop"></div>
          <div className="relative w-64 h-full">
            <AdminSidebar userRoles={userRoles} primaryRole={primaryRole} isMobile={true} />
          </div>
        </div>

        {/* Desktop Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <AdminSidebar userRoles={userRoles} primaryRole={primaryRole} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header */}
          <AdminHeader
            user={{
              name: user.name,
              email: user.email,
              image: null,
              roles: userRoles,
              defaultRole: user.defaultRole as RoleKey | undefined
            }}
          />

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-900">
            {children}
          </main>
        </div>

        <RealtimeUpdates />
      </div>
    </div>
  )
}
