'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Eye, BookOpen, Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  level: string
  duration: string
  price: number
  status: string
  createdAt: string
  updatedAt: string
  _count?: {
    lessons: number
    modules: number
  }
}


export const dynamic = 'force-dynamic'
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      } else {
        setError('Failed to fetch courses')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('Error loading courses')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    
    return matchesSearch && matchesLevel && matchesStatus
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-900 text-green-300'
      case 'Intermediate': return 'bg-yellow-900 text-yellow-300'
      case 'Advanced': return 'bg-red-900 text-red-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-900 text-green-300'
      case 'DRAFT': return 'bg-yellow-900 text-yellow-300'
      case 'ARCHIVED': return 'bg-gray-700 text-gray-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero Header - Matching Home Page Style */}
      <section className="w3-section bg-gray-900 py-16">
        <div className="w3-container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 rounded-full text-sm font-semibold mb-6 text-blue-300">
              <BookOpen className="w-4 h-4" />
              Course Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Manage <span className="text-blue-400">Courses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-10">
              Create, edit, and manage all courses on your platform. 
              Build educational content that helps students learn and succeed.
            </p>

            {/* Quick Action Button */}
            <div className="mb-16">
              <Link
                href="/admin/courses/new"
                className="btn btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-3 font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Course</span>
              </Link>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading courses...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="w3-card bg-red-900/20 border border-red-700/50 p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="text-red-400 text-xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-semibold text-red-300">Error Loading Courses</h3>
                  <p className="text-red-200/80 mt-1">{error}</p>
                  <button
                    onClick={fetchCourses}
                    className="mt-3 btn btn-primary text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content - only show when not loading */}
          {!isLoading && (
            <>
              {/* Stats Cards - Matching Home Page Style */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16 max-w-4xl mx-auto">
                <div className="text-center group">
                  <div className="bg-blue-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-blue-400" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{courses.length}</div>
                  <div className="text-sm lg:text-base text-gray-400 font-medium">Total Courses</div>
                </div>
                <div className="text-center group">
                  <div className="bg-green-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Eye className="w-10 h-10 lg:w-12 lg:h-12 text-green-400" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{courses.filter(c => c.status === 'PUBLISHED').length}</div>
                  <div className="text-sm lg:text-base text-gray-400 font-medium">Published</div>
                </div>
                <div className="text-center group">
                  <div className="bg-purple-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 lg:w-12 lg:h-12 text-purple-400" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{courses.reduce((sum, c) => sum + (c._count?.lessons || 0), 0)}</div>
                  <div className="text-sm lg:text-base text-gray-400 font-medium">Total Lessons</div>
                </div>
                <div className="text-center group">
                  <div className="bg-yellow-900 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Star className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-400" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{courses.filter(c => c.price === 0).length}</div>
                  <div className="text-sm lg:text-base text-gray-400 font-medium">Free Courses</div>
                </div>
              </div>

              {/* Filters Section - Matching Home Page Card Style */}
              <div className="w3-card p-8 mb-12">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control pl-10"
                      />
                    </div>

                    {/* Level Filter */}
                    <select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="form-control"
                    >
                      <option value="all">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-control"
                    >
                      <option value="all">All Status</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Courses Grid - Matching Home Page Course Cards */}
              <div className="course-grid">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="course-card">
                    {/* Course Icon/Image */}
                    <div className="relative mb-4">
                      <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                        <Image
                          src={course.thumbnail || '/course-thumbnails/default.svg'}
                          alt={course.title}
                          width={400}
                          height={192}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(course.status)}`}>
                          {course.status.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="mb-4">
                      <h3 className="course-title mb-2">
                        {course.title}
                      </h3>
                      <p className="course-desc line-clamp-2 mb-4">
                        {course.description}
                      </p>
                    </div>

                    {/* Course Stats */}
                    <div className="course-meta mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course._count?.lessons || 0} lessons</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {course.price === 0 ? (
                          <span className="text-lg font-bold text-green-400">FREE</span>
                        ) : (
                          <span className="text-lg font-bold text-blue-400">
                            ${course.price}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="p-2 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded-lg transition-colors"
                          title="View Course"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/courses/${course.slug}/edit`}
                          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                          title="Edit Course"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={async () => {
                            if (!confirm(`Delete course "${course.title}"? This cannot be undone.`)) return
                            setDeletingId(course.id)
                            try {
                              const res = await fetch(`/api/admin/courses/${course.id}`, { method: 'DELETE' })
                              if (res.ok) {
                                fetchCourses()
                              } else {
                                alert('Failed to delete course')
                              }
                            } catch (err) {
                              alert('Failed to delete course')
                            } finally {
                              setDeletingId(null)
                            }
                          }}
                          className="p-2 bg-red-900 hover:bg-red-800 text-red-400 rounded-lg transition-colors"
                          disabled={deletingId === course.id}
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/courses/${course.slug}/edit`}
                        className="btn btn-primary text-sm flex-1"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty States */}
              {filteredCourses.length === 0 && courses.length > 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No courses found</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find the courses you&apos;re looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setLevelFilter('all')
                      setStatusFilter('all')
                    }}
                    className="btn btn-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {courses.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No courses yet</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Create your first course to start building your educational platform and help students learn.
                  </p>
                  <Link
                    href="/admin/courses/new"
                    className="btn btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Course
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
