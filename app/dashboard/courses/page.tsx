'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AttractiveBackground } from '../../components/AttractiveBackground'
import { BookOpen, Clock, CheckCircle, Play, Star, Calendar } from 'lucide-react'
import Link from 'next/link'

interface EnrolledCourse {
  courseSlug: string
  progress: number
  lastAccessed: string
  completed: boolean
  certificateEarned: boolean
  course: {
    slug: string
    title: string
    description: string
    thumbnail: string
    lessons: number | any[]
    duration: string
  }
}

export default function DashboardCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchEnrolledCourses()
    }
  }, [session])

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/user/enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrolledCourses(data)
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your courses...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6" />
                <h1 className="text-4xl font-bold">My Courses</h1>
              </div>
              <p className="text-xl text-white/90">
                Continue your learning journey and track your progress
              </p>
            </div>
            <Link
              href="/courses"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Enrolled Courses</h2>
            <p className="text-white/60 mb-8">Start your learning journey by enrolling in a course</p>
            <Link
              href="/courses"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {enrolledCourses.map((enrollment) => (
              <div key={enrollment.courseSlug} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start gap-6">
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {enrollment.course.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {enrollment.completed && (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        )}
                        {enrollment.certificateEarned && (
                          <Star className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className="text-sm text-white/60">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-white/70 mb-4">
                      {enrollment.course.description}
                    </p>
                    
                    <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          enrollment.completed ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Last accessed: {new Date(enrollment.lastAccessed).toLocaleDateString()}</span>
                        </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>
                          {Array.isArray(enrollment.course.lessons)
                            ? enrollment.course.lessons.length
                            : enrollment.course.lessons || 0} lessons
                        </span>
                      </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{enrollment.course.duration}</span>
                        </div>
                      </div>
                      <Link 
                        href={`/courses/${enrollment.course.slug}/learn`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        {enrollment.completed ? 'Review' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
