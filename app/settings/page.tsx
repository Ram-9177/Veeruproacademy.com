import { redirect } from 'next/navigation'
import { Bell, Lock, Settings as SettingsIcon, Shield } from 'lucide-react'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AttractiveBackground } from '../components/AttractiveBackground'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login?callbackUrl=/settings')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  })

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />

      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-6 h-6" />
            <h1 className="text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-xl text-white/90">
            Manage your account preferences and notification settings.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <p className="mt-2 text-sm text-white/70">{user?.name ?? 'Student'} · {user?.email ?? 'No email on file'}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 text-white">
                <Bell className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Notification preferences are stored with your account. Editing will be available in a future update.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 text-white">
                <Shield className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Privacy</h3>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Privacy controls will be enabled soon. Reach out to support if you need changes now.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 text-white">
                <SettingsIcon className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Preferences</h3>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Theme and language preferences will sync to your account once settings management is enabled.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 text-white">
                <Lock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Security settings are managed by administrators today. Two-factor setup is coming soon.
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <p className="text-sm text-white/70">
              Need immediate updates? Contact support at support@veerupro.ac and we’ll help you update your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
