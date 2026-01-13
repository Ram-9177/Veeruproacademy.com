'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Play, BookOpen, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { SafeImage } from '@/app/components/SafeImage'

interface EnrolledCourse {
  courseSlug: string
  enrolledAt: string
  completedLessons: number
  totalLessons: number
  progressPercent: number
  course: {
    id: string
    slug: string
    title: string
    description: string
    thumbnail: string | null
    lessons: number | any[]
    duration: string | null
  }
}

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/user/enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrolledCourses(data)
      } else {
        if (response.status === 401) {
          setError('Please login to view your courses')
        } else {
          setError('Failed to load courses')
        }
      }
    } catch (err) {
      console.error('Error loading enrollments:', err)
      setError('An error occurred while loading your courses')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/login" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/80">
      {/* Header */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            My Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {enrolledCourses.length === 0
              ? 'Start learning today! Browse our course catalog and start learning something amazing.'
              : `You have started learning ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''}. Continue your learning journey.`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        {enrolledCourses.length === 0 ? (
          // Empty State
          <div className="rounded-3xl border border-border/30 bg-card/50 backdrop-blur-md p-12 md:p-16 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                No Courses Enrolled Yet
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start your learning journey by browsing our course catalog and enrolling in a course that interests you.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary-hover hover:shadow-lg transition-all duration-200 group"
            >
              <span>Explore Courses</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          // Courses Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(enrollment => (
              <div
                key={enrollment.courseSlug}
                className="group rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-secondary overflow-hidden">
                  {enrollment.course.thumbnail ? (
                    <>
                      <SafeImage
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <BookOpen className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full bg-primary shadow-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                  <div className="p-5 space-y-4">
                  {/* Title & Meta */}
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {Array.isArray(enrollment.course.lessons)
                        ? enrollment.course.lessons.length
                        : enrollment.course.lessons || 0} lessons • {enrollment.course.duration || 'Self-paced'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">Progress</span>
                      <span className="font-bold text-foreground">{Math.round(enrollment.progressPercent)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                        style={{ width: `${enrollment.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Enrolled Date */}
                  <p className="text-xs text-muted-foreground">
                    Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={`/courses/${enrollment.courseSlug}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary-hover hover:shadow-lg transition-all duration-200 group/btn mt-2"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      {enrolledCourses.length > 0 && (
        <div className="container mx-auto px-4 pb-16">
          <div className="rounded-2xl border border-border/30 bg-secondary/30 p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Can&apos;t find a course or having issues? Our support team is here to help.
              </p>
              <Link href="/help" className="text-primary font-semibold text-sm hover:underline">
                Visit Help Center →
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
