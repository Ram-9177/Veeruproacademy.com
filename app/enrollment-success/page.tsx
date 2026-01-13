'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { type Course } from '@/app/types/course'

export default function EnrollmentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(5)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  const courseSlug = searchParams?.get('course')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!courseSlug) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function loadCourse() {
      setLoading(true)
      try {
        const res = await fetch(`/api/courses/${courseSlug}`)
        if (!res.ok) throw new Error('Failed to fetch course')
        const json = await res.json()
        if (!cancelled && json?.data) {
          setCourse(json.data as Course)
          return
        }
      } catch (error) {
        console.error('Failed to load course from API, falling back to static data.', error)
        if (!cancelled) {
          // No fallback to static data
          setCourse(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadCourse()
    return () => {
      cancelled = true
    }
  }, [courseSlug])

  useEffect(() => {
    if (!mounted || !courseSlug) return

    const timer = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          router.push(`/courses/${courseSlug}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [mounted, courseSlug, router])

  if (!mounted || loading) return null

  return (
    <div className="min-h-screen bg-[hsl(var(--neutral))] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="rounded-3xl border border-[hsl(var(--neutral-border))] bg-white p-8 md:p-10 space-y-8 shadow-sm">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/30">
                <CheckCircle2 className="h-14 w-14 text-primary animate-in fade-in zoom-in duration-500" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Enrollment Confirmed! 🎉
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome to your learning journey
            </p>
          </div>

          {/* Course Preview */}
          {course && (
            <div className="rounded-xl border border-[hsl(var(--neutral-border))] bg-[hsl(var(--neutral-subtle))] p-4 space-y-3">
              <div className="flex items-start gap-4">
                {(course.thumbnail || '/placeholder.png') && (
                  <div className="relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-secondary border border-border/30">
                    <Image
                      src={course.thumbnail || '/placeholder.png'}
                      alt={course.title}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.lessons} lessons • {course.duration}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-[hsl(var(--neutral-subtle))] border border-[hsl(var(--neutral-border))] p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-primary">Active</p>
            </div>
            <div className="rounded-lg bg-[hsl(var(--neutral-subtle))] border border-[hsl(var(--neutral-border))] p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Progress</p>
              <p className="text-sm font-semibold text-foreground">0%</p>
            </div>
          </div>

          {/* Redirect Countdown */}
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">
              Redirecting in <span className="font-bold text-primary">{redirectCountdown}s</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href={`/courses/${courseSlug}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary-hover hover:shadow-lg transition-all duration-200 group"
            >
              <span>Learn Now</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-all duration-200"
            >
              Browse More Courses
            </Link>
          </div>

          {/* Tips Section */}
          <div className="pt-4 border-t border-border/20 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase">💡 Pro Tips</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Set aside 1-2 hours per week for consistent learning</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Complete all projects for hands-on practice</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Join our community for questions and support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Questions? Check out our <Link href="/help" className="text-primary hover:underline">Help Center</Link>
          </p>
          <p className="text-xs text-muted-foreground/70">
            Your enrollment is stored securely. Access your courses anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
