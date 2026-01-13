'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'
import { Loader2 } from 'lucide-react'

interface EnrollButtonProps {
  courseId?: string
  courseSlug: string
  courseName: string
  className?: string
  /** Course price in INR. If > 0, redirects to payment page */
  price?: number
}

export function EnrollButton({
  courseId,
  courseSlug,
  courseName,
  className,
  price
}: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  // Check if course is paid
  const isPaid = price && price > 0



  const handleEnroll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // If course is paid, redirect to payment page
    if (isPaid) {
      router.push(`/courses/${courseSlug}/payment`)
      return
    }

    if (!courseId) {
      showError('Configuration error: Missing Course ID')
      return
    }

    // Free course - enroll directly
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/user/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect to login
          const callbackUrl = encodeURIComponent(window.location.pathname)
          router.push(`/login?callbackUrl=${callbackUrl}`)
          return
        }
        throw new Error(data.error || 'Enrollment failed')
      }

      // Success
      showSuccess(`Successfully started learning ${courseName}!`)
      
      // Redirect to the learning page (or first lesson)
      // We assume /learn route exists for the course
      router.push(`/courses/${courseSlug}/learn`)
      
    } catch (error) {
      console.error('Enrollment error:', error)
      showError(error instanceof Error ? error.message : 'Failed to start learning. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate button text based on price
  const getButtonText = () => {
    if (isPaid) {
      return `Learn Now - ₹${price?.toLocaleString('en-IN')}`
    }
    return 'Learn Now'
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className={`group/btn relative overflow-hidden rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg disabled:hover:translate-y-0 ${className ?? ''}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Starting...</span>
          </>
        ) : (
          <>
            <span>{getButtonText()}</span>
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </>
        )}
      </span>
    </button>
  )
}
