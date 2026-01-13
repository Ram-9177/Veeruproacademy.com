'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { cn } from '@/lib/utils'
import { AlertTriangle, RefreshCcw, Search, Star, Package } from 'lucide-react'
import { ProjectUnlockModal } from '@/components/ProjectUnlockModal'
import type { ProjectSummary } from '@/src/modules/projects/types'

const priceFilters = ['All', 'Free', 'Premium'] as const

type ProjectsResponse = {
  success: boolean
  data: ProjectSummary[]
  source?: 'database' | 'static'
  fallbackReason?: string
}

export default function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [price, setPrice] = useState<(typeof priceFilters)[number]>('All')
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null)
  const [unlockModalOpen, setUnlockModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'database' | 'static' | null>(null)
  const [busySlug, setBusySlug] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 220)
    return () => clearTimeout(timer)
  }, [query])

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (debouncedQuery) params.set('search', debouncedQuery)
      if (price !== 'All') params.set('price', price)

      const queryString = params.toString()
      const endpoint = queryString ? `/api/projects?${queryString}` : '/api/projects'

      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload: ProjectsResponse = await response.json()

      if (!payload.success) {
        throw new Error('Unable to load projects right now. Please try again later.')
      }

      setProjects(payload.data ?? [])
      setDataSource(payload.source ?? null)
    } catch (err) {
      console.error('[ProjectsPage] Failed to fetch projects', err)
      setError(err instanceof Error ? err.message : 'Unexpected error while loading projects')
      setProjects([])
      setDataSource(null)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, price])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const sortedProjects = useMemo(() => {
    return projects.slice().sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      if (a.price !== b.price) return b.price - a.price
      return a.title.localeCompare(b.title)
    })
  }, [projects])

  const handleUnlockSelected = (project: ProjectSummary) => {
    setSelectedProject(project)
    setUnlockModalOpen(true)
    setBusySlug(project.slug)
  }

  const handleModalClose = () => {
    setUnlockModalOpen(false)
    setBusySlug(null)
    setSelectedProject(null)
  }

  const handleProjectUpdate = (updated: ProjectSummary) => {
    setProjects((prev) => prev.map((item) => (item.slug === updated.slug ? updated : item)))
    setSelectedProject(updated)
    setBusySlug(null)
  }

  const showSkeletons = loading && projects.length === 0
  const itemsToRender: (ProjectSummary | null)[] = showSkeletons ? [null, null, null, null, null, null] : sortedProjects

  return (
    <main className="min-h-screen bg-gray-900">{/* Same theme as home page */}
      {/* Hero Section - W3Schools Style */}
      <section className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <Package className="w-4 h-4" />
            Final-Year Kits
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Projects that
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-8">
            Impress Reviewers
          </p>

          {/* Description */}
          <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto">
            B.Tech and M.Tech majors and minors with UPI unlocks, Google Drive assets, sandbox-ready code, and manual proof review so you can submit with confidence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">40+</div>
              <div className="text-white/80">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/80">Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24hr</div>
              <div className="text-white/80">Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links - W3Schools Style */}
      <section className="w3-section bg-gray-800">
        <div className="w3-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎓', title: 'Major Projects', desc: 'Complete final year projects' },
              { icon: '📝', title: 'Minor Projects', desc: 'Quick semester projects' },
              { icon: '💻', title: 'Web Apps', desc: 'Full-stack applications' },
              { icon: '🤖', title: 'AI/ML', desc: 'Machine learning projects' }
            ].map((item, i) => (
              <div
                key={i}
                className="w3-card p-6 text-center hover:border-blue-500 transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - W3Schools Style */}
      <section className="w3-section bg-gray-900">
        <div className="w3-container">
          
          {/* Search and Filters */}
          <div className="mb-12">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="form-control w-full pl-12 pr-4 py-4 text-lg"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <span className="text-sm font-bold mr-2 text-gray-300">Filter:</span>
              {priceFilters.map(item => (
                <button
                  key={item}
                  onClick={() => setPrice(item)}
                  className={cn(
                    'px-6 py-2 font-semibold transition-all duration-200 rounded',
                    price === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  )}
                >
                  {item}
                </button>
              ))}
              {dataSource === 'static' && (
                <span className="ml-4 px-3 py-1 text-sm font-medium rounded-full bg-blue-900 text-blue-300 border border-blue-600">
                  Offline mode
                </span>
              )}
            </div>

            {/* Clear Filters */}
            {(debouncedQuery || price !== 'All') && (
              <div className="text-center mt-6">
                <button
                  onClick={() => {
                    setQuery('')
                    setPrice('All')
                  }}
                  className="font-semibold underline hover:text-blue-400 transition-colors text-blue-400"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 flex items-center justify-between border-2 rounded-lg p-4 bg-red-900 border-red-600 text-red-300">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <button
                onClick={fetchProjects}
                className="flex items-center gap-2 px-4 py-2 border rounded font-semibold transition-colors hover:opacity-80 bg-gray-800 border-red-600 text-red-300"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry
              </button>
            </div>
          )}

          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">
              {sortedProjects.length === projects.length ? 'All Projects' : 'Search Results'}
            </h2>
            <p className="text-gray-400">
              {sortedProjects.length} {sortedProjects.length === 1 ? 'project' : 'projects'} found
            </p>
          </div>

          {/* Projects Grid */}
          {itemsToRender.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {itemsToRender.map((project, idx) => (
                <div key={project ? project.slug : `skeleton-${idx}`}>
                  {project ? (
                    <div className="relative">
                      {idx === 0 && project.featured && (
                        <div className="absolute -top-3 left-3 z-10 flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-bold shadow-lg">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </div>
                      )}
                      <ProjectCard 
                        project={project} 
                        busy={busySlug === project.slug} 
                        onUnlock={() => handleUnlockSelected(project)} 
                      />
                    </div>
                  ) : (
                    <div className="h-64 rounded-lg border animate-pulse bg-gray-800 border-gray-700" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-lg bg-gray-800">
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-bold mb-4 text-white">No projects found</h3>
              <p className="mb-8 max-w-md mx-auto text-gray-400">
                We couldn&apos;t find any projects matching your search. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setPrice('All')
                }}
                className="btn btn-primary px-8 py-3 font-semibold"
              >
                Show All Projects
              </button>
            </div>
          )}

          {/* Bottom CTA - W3Schools Style */}
          <div className="mt-20">
            <div className="w3-card bg-blue-600 p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Need a Custom Project?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Contact us for custom final-year projects tailored to your requirements
              </p>
              <a
                href="/contact"
                className="btn bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-10 py-4"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Unlock Modal */}
      {selectedProject && (
        <ProjectUnlockModal
          project={selectedProject}
          open={unlockModalOpen}
          onClose={handleModalClose}
          onProjectUpdate={handleProjectUpdate}
          onProjectError={() => setBusySlug(null)}
        />
      )}
    </main>
  )
}
