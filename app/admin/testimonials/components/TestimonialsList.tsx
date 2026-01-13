'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Star } from 'lucide-react'
import { Badge } from '@/app/components/Badge'
import { SafeImage } from '@/app/components/SafeImage'

interface Testimonial {
  id: string
  name: string
  role: string | null
  quote: string
  avatarUrl: string | null
  highlight: string | null
  rating: number
  status: string
  order: number
}

interface TestimonialsListProps {
  testimonials: Testimonial[]
}

export function TestimonialsList({ testimonials }: TestimonialsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.quote.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="p-6 border-b border-neutral-200">
        <input
          type="text"
          placeholder="Search testimonials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      <div className="divide-y divide-neutral-200">
        {filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No testimonials found</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {testimonial.avatarUrl && (
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-neutral-200 flex-shrink-0 relative">
                    <SafeImage
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900">{testimonial.name}</h3>
                        {testimonial.highlight && (
                          <Badge tone="green">{testimonial.highlight}</Badge>
                        )}
                        <div className="flex items-center gap-0.5">
                          {/* Static 5 stars to avoid hydration mismatch */}
                          <Star className={`h-4 w-4 ${testimonial.rating >= 1 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          <Star className={`h-4 w-4 ${testimonial.rating >= 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          <Star className={`h-4 w-4 ${testimonial.rating >= 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          <Star className={`h-4 w-4 ${testimonial.rating >= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          <Star className={`h-4 w-4 ${testimonial.rating >= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        </div>
                      </div>
                      {testimonial.role && (
                        <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      )}
                      <p className="text-sm text-neutral-700 mt-2 line-clamp-2 italic">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge
                          tone={testimonial.status === 'PUBLISHED' ? 'green' : 'neutral'}
                        >
                          {testimonial.status}
                        </Badge>
                        <span className="text-xs text-neutral-500">Order: {testimonial.order}</span>
                      </div>
                    </div>
                    <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                      <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Edit className="h-4 w-4 text-neutral-600" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

