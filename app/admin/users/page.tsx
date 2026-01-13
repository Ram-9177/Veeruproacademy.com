'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, UserPlus, Edit, Trash2, Mail, Shield, Users } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'mentor' | 'student'
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  lastLogin: string
  coursesEnrolled: number
  projectsCompleted: number
  avatar?: string
}


export const dynamic = 'force-dynamic'
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [totalUsers, setTotalUsers] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalUsers(data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'mentor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'student': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'inactive': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Users className="w-4 h-4" />
            User Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">User Management</h1>
          <p className="text-xl text-white/90">
            Manage users, roles, and permissions
          </p>
        </div>
      </div>

      <div className="w3-container py-12 space-y-10">
        {/* Filters */}
        <div className="w3-card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control pl-10"
                />
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-control"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="mentor">Mentor</option>
              <option value="student">Student</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <button className="btn btn-primary">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="w3-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalUsers}</div>
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
            </div>
          </div>
          <div className="w3-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{users.filter(u => u.status === 'active').length}</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </div>
          </div>
          <div className="w3-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Mail className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'mentor').length}</div>
                <div className="text-sm text-gray-400">Mentors</div>
              </div>
            </div>
          </div>
          <div className="w3-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <UserPlus className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'student').length}</div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="w3-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Courses</th>
                  <th>Projects</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-white">{user.coursesEnrolled}</td>
                    <td className="text-white">{user.projectsCompleted}</td>
                    <td className="text-gray-400 text-sm">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="Edit user">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Delete user "${user.email}"? This cannot be undone.`)) return
                            setDeletingId(user.id)
                            try {
                              const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
                              if (!res.ok) throw new Error('Delete failed')
                              fetchUsers()
                            } catch (e) {
                              alert('Failed to delete user')
                            } finally {
                              setDeletingId(null)
                            }
                          }}
                          disabled={deletingId === user.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
