import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Calendar, Mail, User } from 'lucide-react'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AttractiveBackground } from '../components/AttractiveBackground'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    redirect('/login?callbackUrl=/profile')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      headline: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      status: true,
    },
  })

  if (!user) {
    redirect('/login?callbackUrl=/profile')
  }

  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6" />
            <h1 className="text-4xl font-bold">My Profile</h1>
          </div>
          <p className="text-xl text-white/90">
            Your account details and public profile summary.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
            <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden border border-white/20 bg-white/10">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name ?? 'User avatar'}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                  {(user.name?.[0] ?? 'U').toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{user.name ?? 'Student'}</h2>
            <p className="text-sm text-white/70">{user.headline ?? 'Learner at Veeru Pro Academy'}</p>
            <p className="mt-2 text-xs text-white/50">Status: {user.status}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">Account</h3>
              <div className="mt-4 space-y-3 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/70" />
                  <span>{user.email ?? 'No email on file'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-white/70" />
                  <span>Joined {joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">About</h3>
              <p className="mt-3 text-sm text-white/70">
                {user.bio ?? 'No bio added yet. Profile editing will be enabled in a future update.'}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">Profile Updates</h3>
              <p className="mt-3 text-sm text-white/70">
                Profile editing is coming soon. For urgent updates, contact support at support@veerupro.ac.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
