'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Edit, Trash2, Eye, FileText, Video, Code } from 'lucide-react';

interface ContentItem {
  id: string
  title: string
  type: 'page' | 'lesson' | 'project' | 'tutorial'
  status: 'published' | 'draft' | 'archived'
  author: string
  createdAt: string
  updatedAt: string
  views?: number
  courseSlug?: string
}

// Mock content removed
export const dynamic = 'force-dynamic'

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/content')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setContent(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this specific content? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      
      if (result.success) {
        alert('Content deleted successfully')
        fetchContent() 
      } else {
        throw new Error(result.error || 'Failed to delete content')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Failed to delete content')
    }
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return Video
      case 'project': return Code
      case 'tutorial': return FileText
      case 'page': return FileText
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'project': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'tutorial': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'page': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading content...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <FileText className="w-4 h-4" />
            Content Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Manage Content</h1>
          <p className="text-xl text-white/90">
            Create and manage lessons, projects, tutorials, and pages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{content.filter(c => c.type === 'lesson').length}</div>
                <div className="text-sm text-muted-foreground">Lessons</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{content.filter(c => c.type === 'project').length}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{content.filter(c => c.type === 'tutorial').length}</div>
                <div className="text-sm text-muted-foreground">Tutorials</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-500/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{content.filter(c => c.type === 'page').length}</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-xl p-5 border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Types</option>
                <option value="lesson">Lessons</option>
                <option value="project">Projects</option>
                <option value="tutorial">Tutorials</option>
                <option value="page">Pages</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Content</th>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Type</th>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Status</th>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Author</th>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Views</th>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Updated</th>
                  <th className="text-left px-6 py-4 text-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContent.map((item) => {
                  const TypeIcon = getTypeIcon(item.type)
                  
                  return (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{item.title}</div>
                            {item.courseSlug && (
                              <div className="text-sm text-muted-foreground">Course: {item.courseSlug}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">{item.author}</td>
                      <td className="px-6 py-4 text-foreground">{item.views || '-'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <Link 
                            href={`/admin/content/${item.id}/edit`}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No content found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
                setStatusFilter('all')
              }}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
