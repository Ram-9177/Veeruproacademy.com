'use client'

import { Clock, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CourseDisplay {
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

export function PopularCourses({ courses }: { courses: CourseDisplay[] }) {
  // Use passed courses or show empty state if none
  const displayCourses = courses.slice(0, 3)

  if (displayCourses.length === 0) {
    return null // content not ready
  }

  return (
    <section className="w3-section bg-gray-900">
      <div className="w3-container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-300">
              Start your journey with our most loved courses
            </p>
          </div>
          <Link href="/courses" className="btn btn-outline hidden md:flex items-center gap-2">
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="course-grid">
          {displayCourses.map((course) => (
            <div
              key={course.slug}
              className="course-card"
            >
              {/* Course Icon */}
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">
                  {course.language === 'JavaScript' ? '🟨' : 
                   course.language === 'Python' ? '🐍' : 
                   course.language === 'TypeScript' ? '🔷' : 
                   course.language === 'UI/UX' ? '🎨' : 
                   course.language === 'Data' ? '📊' : 
                   course.language === 'AI' ? '🤖' : '📚'}
                </span>
              </div>

              {/* Course Content */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    course.level === 'Beginner' ? 'bg-green-900 text-green-300' :
                    course.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {course.level}
                  </span>
                  {course.language && (
                    <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded font-medium">
                      {course.language}
                    </span>
                  )}
                </div>

                <h3 className="course-title">
                  {course.title}
                </h3>

                <p className="course-desc line-clamp-2">
                  {course.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="course-meta mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  {!course.price || course.price === 0 ? (
                    <span className="text-lg font-bold text-green-400">Free</span>
                  ) : (
                    <div>
                      <span className="text-lg font-bold text-blue-400">
                        ₹{course.price?.toLocaleString()}
                      </span>
                      {course.originalPrice && course.price < course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{course.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="btn btn-primary text-sm"
                >
                  Learn Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link href="/courses" className="btn btn-outline inline-flex items-center gap-2">
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}