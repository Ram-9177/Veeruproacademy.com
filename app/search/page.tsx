'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, BookOpen, FileText, Folder, Clock, Users, ArrowRight, Loader2 } from 'lucide-react'

interface SearchResult {
  type: 'course' | 'project' | 'lesson' | 'user'
  id: string
  title: string
  slug: string
  description?: string
  duration?: string
  level?: string
  language?: string
  thumbnail?: string
  price?: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams?.get('q') || ''
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)
  const [totalResults, setTotalResults] = useState(0)

  // Debounced search function
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setResults([])
      setTotalResults(0)
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&limit=24`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data || [])
        setTotalResults(data.total || 0)
      } else {
        setResults([])
        setTotalResults(0)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== query) {
        performSearch(searchQuery)
        if (searchQuery.trim()) {
          router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false })
        }
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, query, performSearch, router])

  // Initial search on page load
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen
      case 'project': return Folder
      case 'lesson': return FileText
      case 'user': return Users
      default: return BookOpen
    }
  }

  const getHref = (result: SearchResult) => {
    switch (result.type) {
      case 'course': return `/courses/${result.slug}`
      case 'project': return `/projects/${result.slug}`
      case 'lesson': return `/lessons/${result.slug}`
      case 'user': return `/profile/${result.slug}`
      default: return `/courses/${result.slug}`
    }
  }

  const popularSearches = [
    'React', 'JavaScript', 'Python', 'HTML', 'CSS', 'Node.js', 'TypeScript', 'Next.js'
  ]

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Search Section - Matching Home Page Style */}
      <section className="w3-section bg-gray-900 py-16">
        <div className="w3-container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 rounded-full text-sm font-semibold mb-6 text-blue-300">
              <Search className="w-4 h-4" />
              Search Learning Resources
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect <span className="text-blue-400">Learning Path</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-10">
              Search through our comprehensive collection of courses, projects, and tutorials. 
              Discover the skills you need to advance your career.
            </p>

            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, projects, tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-32 py-5 text-lg bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search
                </button>
              </div>
            </form>

            {/* Search Results Summary */}
            {query && (
              <div className="mb-8">
                {loading ? (
                  <p className="text-gray-400">Searching...</p>
                ) : (
                  <p className="text-gray-400">
                    {totalResults > 0 
                      ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`
                      : `No results found for "${query}"`
                    }
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Search Results */}
          {results.length > 0 ? (
            <div className="course-grid">
              {results.map((result) => {
                const Icon = getIcon(result.type)
                
                return (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={getHref(result)}
                    className="course-card group"
                  >
                    {/* Result Icon/Image */}
                    <div className="mb-4">
                      {result.thumbnail ? (
                        <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                          <Image
                            src={result.thumbnail}
                            alt={result.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className={`w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-16 h-16 text-gray-400`} />
                        </div>
                      )}
                    </div>

                    {/* Result Content */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          result.type === 'course' ? 'bg-blue-900 text-blue-300' :
                          result.type === 'project' ? 'bg-purple-900 text-purple-300' :
                          result.type === 'lesson' ? 'bg-green-900 text-green-300' :
                          'bg-orange-900 text-orange-300'
                        } capitalize`}>
                          {result.type}
                        </span>
                        {result.level && (
                          <span className="px-2 py-1 text-xs rounded font-medium bg-gray-700 text-gray-300">
                            {result.level}
                          </span>
                        )}
                      </div>

                      <h3 className="course-title mb-2 group-hover:text-blue-400 transition-colors">
                        {result.title}
                      </h3>

                      {result.description && (
                        <p className="course-desc line-clamp-2 mb-4">
                          {result.description}
                        </p>
                      )}
                    </div>

                    {/* Result Meta */}
                    <div className="course-meta mb-4">
                      {result.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{result.duration}</span>
                        </div>
                      )}
                      {result.language && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{result.language}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        {result.price !== undefined ? (
                          result.price === 0 ? (
                            <span className="text-lg font-bold text-green-400">FREE</span>
                          ) : (
                            <span className="text-lg font-bold text-blue-400">
                              ${result.price}
                            </span>
                          )
                        ) : (
                          <span className="text-sm text-gray-500">View Details</span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : query && !loading ? (
            /* No Results State */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No results found</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or browse our categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses" className="btn btn-primary">
                  Browse All Courses
                </Link>
                <Link href="/projects" className="btn btn-outline">
                  View Projects
                </Link>
              </div>
            </div>
          ) : !query ? (
            /* Welcome State with Popular Searches */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">What would you like to learn?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Search for courses, projects, or tutorials to start your learning journey.
              </p>
              
              {/* Popular Searches */}
              <div className="max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-4">Popular Searches</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term)
                        performSearch(term)
                        router.push(`/search?q=${encodeURIComponent(term)}`)
                      }}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
              <span className="text-gray-400">Searching...</span>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
