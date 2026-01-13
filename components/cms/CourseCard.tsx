/**
 * CourseCard - Reusable component for displaying course information
 * Used across homepage, courses page, and course listings
 */

import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Users, Lock } from 'lucide-react'
import type { CmsCourseCard } from '@/lib/cms/content-types'

type CourseCardProps = {
  course: CmsCourseCard
  className?: string
}

export function CourseCard({ course, className = '' }: CourseCardProps) {
  return (
    <Link href={course.ctaLink || `/courses/${course.slug}`}>
      <div
        className={`card card-hover group overflow-hidden ${className}`}
      >
        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={course.image.url}
            alt={course.image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badge Overlay */}
          {course.badge && (
            <div className="absolute top-4 left-4">
              <span className={`badge ${getBadgeVariantClass(course.badge.variant)}`}>
                {course.badge.label}
              </span>
            </div>
          )}
          
          {/* Lock Overlay */}
          {course.isLocked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-6 space-y-4">
          {/* Difficulty Badge */}
          <div className="flex items-center gap-2">
            <span className={`badge ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
            {course.isPremium && (
              <span className="badge bg-amber-50 text-amber-700 border-amber-200">
                Premium
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.lessons} lessons</span>
            </div>
            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          {course.techStack && course.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.techStack.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                >
                  {tech.name}
                </span>
              ))}
              {course.techStack.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                  +{course.techStack.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Pricing and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {course.price}
              </span>
              {course.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {course.originalPrice}
                </span>
              )}
            </div>
            <button className="btn btn-primary">
              {course.ctaLabel || 'Learn Now'}
            </button>
          </div>

          {/* Features */}
          {course.features && course.features.length > 0 && (
            <ul className="space-y-2 pt-4 border-t border-gray-100">
              {course.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
  )
}

// Helper functions
function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'intermediate':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'advanced':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function getBadgeVariantClass(variant?: string): string {
  switch (variant) {
    case 'success':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'error':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-blue-50 text-primary border-blue-200'
  }
}
