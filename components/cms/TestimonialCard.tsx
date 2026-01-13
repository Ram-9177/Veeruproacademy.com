/**
 * TestimonialCard - Reusable testimonial component
 */

import Image from 'next/image'
import { Star } from 'lucide-react'
import type { CmsTestimonial } from '@/lib/cms/content-types'

type TestimonialCardProps = {
  testimonial: CmsTestimonial
  className?: string
}

export function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  return (
    <div className={`card p-6 space-y-4 ${className}`}>
      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < testimonial.rating!
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-gray-700 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={testimonial.avatar.url}
            alt={testimonial.avatar.alt}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-600">
            {testimonial.role}
            {testimonial.company && ` at ${testimonial.company}`}
          </div>
        </div>
        {testimonial.badge && (
          <span className="ml-auto badge bg-primary/10 text-primary text-xs">
            {testimonial.badge.label}
          </span>
        )}
      </div>
    </div>
  )
}
