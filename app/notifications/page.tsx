import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Bell } from 'lucide-react'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const metadata = {
  title: "Notifications - Veeru's Pro Academy",
  description: 'View your notifications and updates'
}

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login?callbackUrl=/notifications')
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const items = notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.body,
    createdAt: notification.createdAt,
    read: Boolean(notification.readAt),
    actionUrl: notification.actionUrl,
  }))

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Bell className="w-4 h-4" />
            Notifications
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Notifications
          </h1>
          <p className="text-xl text-white/90">
            Stay updated with your learning progress and platform updates
          </p>
        </div>
      </section>

      {/* Notifications List */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          <div className="max-w-4xl mx-auto">
            <div className="w3-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Notifications</h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No notifications yet</p>
                  <p className="text-gray-500 text-sm mt-2">
                    You&apos;ll see updates about your courses and activity here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-5 rounded-xl border transition-colors ${
                        notification.read
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-gray-700 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <Bell className={`w-5 h-5 ${notification.read ? 'text-gray-400' : 'text-blue-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-white mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-gray-300 text-sm mb-2">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleString()}
                              </span>
                            </div>
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                className="text-xs text-blue-300 hover:text-blue-200"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="btn btn-primary"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/courses"
                className="btn btn-outline"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
