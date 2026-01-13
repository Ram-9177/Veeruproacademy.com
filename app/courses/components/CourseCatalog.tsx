'use client'

import { useState, useMemo } from 'react'
import { Search, Clock, BookOpen, Code, Palette, BarChart3, Brain } from 'lucide-react'
import Link from 'next/link'

type FilterOption = 'all' | 'free' | 'paid' | 'beginner' | 'intermediate' | 'advanced'

interface CatalogCourse {
  slug: string
  title: string
  description: string | null
  level: string | null
  language?: string
  thumbnail: string | null
  duration: string | null
  price: number
  originalPrice?: number
  lessons: number
}

export function CourseCatalog({ courses }: { courses: CatalogCourse[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      // Safe checks for null fields
      const title = course.title || ''
      const desc = course.description || ''
      
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           desc.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      switch (filterBy) {
        case 'free':
          return !course.price || course.price === 0
        case 'paid':
          return course.price > 0
        case 'beginner':
          return course.level === 'Beginner'
        case 'intermediate':
          return course.level === 'Intermediate'
        case 'advanced':
          return course.level === 'Advanced'
        default:
          return true
      }
    })

    return filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  }, [courses, searchQuery, filterBy])

  const stats = {
    total: courses.length,
    free: courses.filter(c => !c.price || c.price === 0).length,
    paid: courses.filter(c => c.price > 0).length,
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Clean Header */}
      <section className="w3-section bg-gray-800">
        <div className="w3-container text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Free Programming Courses
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Learn programming for FREE with clear examples and practical projects. 
            Choose from {stats.total} courses - {stats.free} are completely FREE!
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold">
            <span>🎉</span>
            <span>All courses are FREE - No hidden costs!</span>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-gray-700">
        <div className="w3-container">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'all', label: 'All Courses', count: stats.total },
              { key: 'free', label: 'Free', count: stats.free },
              { key: 'paid', label: 'Paid', count: stats.paid },
              { key: 'beginner', label: 'Beginner', count: courses.filter(c => c.level === 'Beginner').length },
              { key: 'intermediate', label: 'Intermediate', count: courses.filter(c => c.level === 'Intermediate').length },
              { key: 'advanced', label: 'Advanced', count: courses.filter(c => c.level === 'Advanced').length }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterBy(filter.key as FilterOption)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  filterBy === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="w3-container">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterBy('all')
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="course-grid">
              {filteredCourses.map((course) => (
                <div key={course.slug} className="course-card">
                  {/* Course Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    {course.language === 'JavaScript' ? (
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    ) : course.language === 'Python' ? (
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    ) : course.language === 'TypeScript' ? (
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    ) : course.language === 'UI/UX' ? (
                      <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    ) : course.language === 'Data' ? (
                      <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    ) : course.language === 'AI' ? (
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                    ) : (
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        course.level === 'Beginner' ? 'bg-green-900 text-green-300' :
                        course.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {course.level || 'Beginner'}
                      </span>
                      {course.language && (
                        <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded font-medium">
                          {course.language}
                        </span>
                      )}
                      {!course.price && (
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-bold">
                          FREE
                        </span>
                      )}
                    </div>
                    <h3 className="course-title text-base sm:text-lg">{course.title}</h3>
                    <p className="course-desc line-clamp-2 text-sm">{course.description}</p>
                  </div>

                  {/* Course Stats */}
                  <div className="course-meta mb-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{course.duration || 'Self-paced'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      {!course.price || course.price === 0 ? (
                        <span className="text-base sm:text-lg font-bold text-green-400">Free</span>
                      ) : (
                        <div>
                          <span className="text-base sm:text-lg font-bold text-blue-400">
                            ₹{course.price?.toLocaleString()}
                          </span>
                          {course.originalPrice && course.price < course.originalPrice && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
                              ₹{course.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="btn btn-primary text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
                    >
                      Learn Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Info */}
          {filteredCourses.length > 0 && (
            <div className="text-center mt-8 text-gray-400">
              Showing {filteredCourses.length} of {courses.length} courses
              {searchQuery && (
                <span> for &quot;<span className="text-blue-400 font-medium">{searchQuery}</span>&quot;</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w3-section bg-gray-800">
        <div className="w3-container text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have learned programming with our clear, step-by-step courses.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link href="/signup" className="btn btn-primary">
              Create Free Account
            </Link>
            <Link href="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
