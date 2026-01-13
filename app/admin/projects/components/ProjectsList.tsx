'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Eye, Star } from 'lucide-react'
import { Badge } from '@/app/components/Badge'
import { formatPrice, cn } from '@/lib/utils'

interface Project {
  id: string
  slug: string
  title: string
  description: string | null
  status: string
  price: number
  featured: boolean
  level: string | null
  category: string | null
  createdAt: Date
}

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'free' | 'premium'>('all')

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'free' && project.price === 0) ||
      (filterStatus === 'premium' && project.price > 0)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="p-6 border-b border-neutral-200 space-y-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
        <div className="flex gap-2">
          {(['all', 'free', 'premium'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
                filterStatus === filter
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-neutral-200">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">{project.title}</h3>
                        {project.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                        <Badge tone={project.price === 0 ? 'green' : 'gold'}>
                          {project.price === 0 ? 'Free' : formatPrice(project.price)}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                        {project.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge
                          tone={project.status === 'PUBLISHED' ? 'green' : 'neutral'}
                        >
                          {project.status}
                        </Badge>
                        {project.level && (
                          <span className="text-xs text-neutral-500">{project.level}</span>
                        )}
                        {project.category && (
                          <span className="text-xs text-neutral-500">{project.category}</span>
                        )}
                        <span className="text-xs text-neutral-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/projects/${project.slug}`} target="_blank">
                        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Eye className="h-4 w-4 text-neutral-600" />
                        </button>
                      </Link>
                      <Link href={`/admin/projects/${project.slug}/edit`}>
                        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit className="h-4 w-4 text-neutral-600" />
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

