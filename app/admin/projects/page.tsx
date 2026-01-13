'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, Code, Calendar, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { AttractiveBackground } from '../../components/AttractiveBackground'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  level: string
  category: string
  price: number
  tools: string[]
  includes: string[]
  driveUrl: string
  upiId: string
  formUrl: string
  status: string
  featured: boolean
  thumbnail: string
  createdAt: string
  updatedAt: string
}


export const dynamic = 'force-dynamic'
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tools?.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Advanced': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'DRAFT': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'ARCHIVED': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
        <AttractiveBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading projects...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
              <Code className="w-4 h-4" />
              Projects Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Manage Projects
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Create and manage coding projects for your students
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{projects.length}</div>
                <div className="text-sm text-white/60">Total Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {projects.filter(p => p.status === 'PUBLISHED').length}
                </div>
                <div className="text-sm text-white/60">Published</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {projects.filter(p => p.featured).length}
                </div>
                <div className="text-sm text-white/60">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Filters */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Data Science">Data Science</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Game Development">Game Development</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(project.level || 'Beginner')}`}>
                    {project.level || 'Beginner'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">₹{project.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/60">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {project.tools && project.tools.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tools.slice(0, 3).map((tool) => (
                      <span key={tool} className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/80">
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/80">
                        +{project.tools.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${project.slug || project.id}/edit`}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </Link>
                  <Link
                    href={`/admin/projects/${project.slug || project.id}`}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View
                  </Link>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete project "${project.title}"? This cannot be undone.`)) return
                    setDeletingId(project.id)
                    try {
                      const res = await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' })
                      if (!res.ok) throw new Error('Delete failed')
                      fetchProjects()
                    } catch (e) {
                      alert('Failed to delete project')
                    } finally {
                      setDeletingId(null)
                    }
                  }}
                  disabled={deletingId === project.id}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Code className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-white/60 mb-6">Try adjusting your search or filters</p>
            <Link
              href="/admin/projects/new"
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
