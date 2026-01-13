'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CreditCard,
  Upload,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/app/components/Button'
import { type Course } from '@/app/types/course'
import { useToast } from '@/lib/toast-context'
import UpiBuyWidget from '@/components/UpiBuyWidget'
import { UploadDropzone } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

type PaymentStep = 'overview' | 'payment' | 'pending' | 'success'

export default function CoursePaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError, showLoading, removeToast } = useToast()
  const courseSlug = params?.courseSlug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  const [step, setStep] = useState<PaymentStep>('overview')
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected' | 'free'>('none')
  const [adminNotes, setAdminNotes] = useState<string | null>(null)
  const [submittedAt, setSubmittedAt] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Check if already enrolled via API (simplified check by just fetching enrollments)
  // Or rely on the fact that if user is enrolled, they should see "Continue Learning" on course page.
  // We can skip this check for now or implement a dedicated check API.
  
  // Check if course is free - redirect to direct enrollment
  useEffect(() => {
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
        console.error('Failed to load course from API.', error)
        // No fallback
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
    if (course && (!course.price || course.price === 0)) {
      router.push(`/courses/${courseSlug}`)
    }
  }, [course, courseSlug, router])

  useEffect(() => {
    if (!course || !courseSlug) return
    if (!course.price || course.price === 0) return

    let cancelled = false

    async function loadPaymentStatus() {
      try {
        const res = await fetch(`/api/courses/${courseSlug}/payment`, { cache: 'no-store' })
        if (res.status === 401) {
          const callbackUrl = encodeURIComponent(window.location.pathname)
          router.push(`/login?callbackUrl=${callbackUrl}`)
          return
        }
        if (!res.ok) return

        const json = await res.json()
        if (!json?.success || !json?.data || cancelled) return

        const status = json.data.status as typeof requestStatus
        setRequestStatus(status)
        setProofUrl(json.data.proofUrl ?? null)
        setAdminNotes(json.data.notes ?? null)
        setSubmittedAt(json.data.submittedAt ?? null)

        if (status === 'approved') {
          setStep('success')
        } else if (status === 'pending') {
          setStep('pending')
        } else if (status === 'rejected') {
          setStep('payment')
        } else if (status === 'free') {
          router.push(`/courses/${courseSlug}`)
        }
      } catch (error) {
        console.error('[Payment] Failed to fetch payment status', error)
      }
    }

    loadPaymentStatus()
    return () => {
      cancelled = true
    }
  }, [course, courseSlug, router])

  useEffect(() => {
    setUploadError(null)
  }, [step])

  const handlePaymentSubmit = async () => {
    if (!proofUrl) {
      showError('Please upload your payment screenshot')
      return
    }

    if (!course?.slug) {
      showError('Course not found')
      return
    }

    setSubmitting(true)
    const loadingId = showLoading('Submitting payment proof...')

    try {
      const res = await fetch(`/api/courses/${course.slug}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proofUrl,
          notes: notes.trim() || null,
        })
      })

      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Payment submission failed')
      }

      const status = json?.data?.status as typeof requestStatus
      setRequestStatus(status)
      setProofUrl(json?.data?.proofUrl ?? proofUrl)
      setAdminNotes(json?.data?.notes ?? null)
      setSubmittedAt(json?.data?.submittedAt ?? null)

      removeToast(loadingId)
      if (status === 'approved') {
        showSuccess('Payment verified! Course unlocked.')
        setStep('success')
      } else {
        showSuccess('Payment proof submitted. We will verify it shortly.')
        setStep('pending')
      }
    } catch (error) {
      removeToast(loadingId)
      showError(error instanceof Error ? error.message : 'Payment submission failed. Please try again.')
      console.error('[Payment] Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
          <Link href="/courses" className="mt-4 text-primary hover:underline">
            Browse courses
          </Link>
        </div>
      </div>
    )
  }

  const thumbnailSrc = course.thumbnail || '/placeholder.png'

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link
          href={`/courses/${courseSlug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Course Summary Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={thumbnailSrc}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-foreground">{course.title}</h1>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {course.lessons} lessons
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Steps */}
            {step === 'overview' && (
              <div className="space-y-6">
                {/* Payment Info */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Complete Your Enrollment</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Pay via UPI and upload your payment screenshot to unlock instant access.
                  </p>

                  <div className="mt-6 flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <CreditCard className="h-8 w-8 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-emerald-900">Simple UPI Payment</p>
                      <p className="text-sm text-emerald-700">
                        Pay using PhonePe, GPay, Paytm, or any UPI app
                      </p>
                    </div>
                  </div>

                  {/* What you get */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-foreground">What you get:</h3>
                    <ul className="mt-3 space-y-2">
                      {(course.paymentFeatures || [
                        'Lifetime access to all course content',
                        'Downloadable resources & code',
                        'Certificate of completion',
                        'Community access & support',
                      ]).map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button onClick={() => setStep('payment')} className="mt-6 w-full" size="lg">
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">Payment Details</h2>
                  {requestStatus === 'rejected' && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      <p className="font-semibold text-red-900">Previous submission needs attention</p>
                      <p className="mt-1">Please upload a clearer payment screenshot for verification.</p>
                      {adminNotes && <p className="mt-2 text-xs text-red-700">Admin notes: {adminNotes}</p>}
                    </div>
                  )}

                  {/* UPI Info */}
                  <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <UpiBuyWidget amount={course.price ?? 0} />
                  </div>

                  {/* Upload Screenshot */}
                  <div className="mt-6 space-y-3">
                    <label className="block text-sm font-medium text-foreground">
                      Upload Payment Screenshot
                    </label>
                    {proofUrl ? (
                      <div className="space-y-2">
                        <div className="relative h-48 overflow-hidden rounded-xl border border-neutral-200">
                          <Image
                            src={proofUrl}
                            alt="Payment proof"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setProofUrl(null)}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Remove uploaded screenshot
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition hover:border-primary hover:bg-neutral-100">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload or drag & drop
                          </span>
                          <span className="text-xs text-muted-foreground">
                            PNG, JPG up to 8MB. Ensure UPI ID and amount are visible.
                          </span>
                        </div>
                        <div className="mt-3">
                          <UploadDropzone<OurFileRouter, 'coursePaymentProof'>
                            endpoint="coursePaymentProof"
                            onClientUploadComplete={(files) => {
                              const file = files?.[0]
                              if (file?.url) {
                                setProofUrl(file.url)
                                setUploadError(null)
                              }
                            }}
                            onUploadError={(err: Error) => {
                              setUploadError(err.message)
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-xs text-red-500">{uploadError}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground">
                      Transaction ID / Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2 h-20 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Add transaction ID or any additional details..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep('overview')}
                      disabled={submitting}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handlePaymentSubmit}
                      disabled={submitting || !proofUrl}
                    >
                      {submitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Submit Payment'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 'pending' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-amber-900">Payment Under Review</h2>
                <p className="mt-2 text-sm text-amber-700">
                  We&apos;ve received your payment screenshot. Our team will verify and unlock your access within 24 hours.
                </p>
                {submittedAt && (
                  <p className="mt-2 text-xs text-amber-700/80">
                    Submitted {new Date(submittedAt).toLocaleString()}
                  </p>
                )}
                {adminNotes && (
                  <p className="mt-3 text-xs text-amber-800">Admin notes: {adminNotes}</p>
                )}
                {proofUrl && (
                  <div className="mx-auto mt-4 max-w-sm overflow-hidden rounded-xl border border-amber-200 bg-white">
                    <div className="relative h-48">
                      <Image
                        src={proofUrl}
                        alt="Submitted payment proof"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => router.push('/my-courses')}
                >
                  Go to My Courses
                </Button>
              </div>
            )}

            {step === 'success' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Sparkles className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-emerald-900">
                  Course Unlocked! 🎉
                </h2>
                <p className="mt-2 text-sm text-emerald-700">
                  Congratulations! You now have full access to {course.title}.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button onClick={() => router.push(`/courses/${courseSlug}/learn`)}>
                    Start Learning
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/courses')}>
                    Browse More Courses
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Course Price</span>
                  {course.originalPrice && course.originalPrice > (course.price || 0) ? (
                    <span className="text-muted-foreground line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  ) : null}
                </div>
                {course.originalPrice && course.originalPrice > (course.price || 0) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount</span>
                    <span className="text-emerald-600">
                      -₹{(course.originalPrice - (course.price || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">₹{course.price?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 border-t border-border pt-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <span>Secure payment verification</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Instant access after payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CreditCard className="h-5 w-5 text-emerald-500" />
                  <span>All UPI apps accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
