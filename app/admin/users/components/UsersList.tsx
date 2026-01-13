'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Edit, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ROLE_KEYS, USER_STATUS, type RoleKey, type UserStatus } from '@/lib/types/auth'

interface UserType {
  id: string
  email: string
  name: string | null
  defaultRole: RoleKey
  roles: RoleKey[]
  status: UserStatus
  lastLoginAt: Date | string | null
  createdAt: Date | string
  avatarUrl: string | null
}

interface UsersListProps {
  users: UserType[]
}

const roleColors: Record<RoleKey, string> = {
  [ROLE_KEYS.ADMIN]: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  [ROLE_KEYS.MENTOR]: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  [ROLE_KEYS.STUDENT]: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
}

export function UsersList({ users }: UsersListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="bg-white/5 rounded-3xl border border-white/10 shadow-sm">
      <div className="p-6 border-b border-white/10">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:border-primary transition-colors bg-card border-border text-foreground"
        />
      </div>

      <div className="divide-y divide-white/10">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name || 'User avatar'}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {user.name || 'No name'}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-md ${roleColors[user.defaultRole] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`}>
                          {user.defaultRole.replace('_', ' ')}
                        </span>
                        {user.roles
                          .filter((role) => role !== user.defaultRole)
                          .map((role) => (
                            <span key={role} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-md border border-emerald-500/30">
                              {role.replace('_', ' ')}
                            </span>
                          ))}
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${
                            user.status === USER_STATUS.ACTIVE 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {user.lastLoginAt ? (
                          <span>Last login: {formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })}</span>
                        ) : (
                          <span>Never logged in</span>
                        )}
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <button className="p-2 rounded-2xl hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

