'use client'

import { Star, Quote } from 'lucide-react'

export interface Testimonial {
  id: string
  name: string
  role: string | null
  avatarUrl: string | null
  quote: string
  rating: number
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials = [] }: TestimonialsProps) {
  // Use passed testimonials or fallback to empty array (or maybe show nothing if empty)
  if (testimonials.length === 0) return null

  return (
    <section className="section-lg bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Success Stories from
            <span className="block gradient-text">Our Students</span>
          </h2>
          <p className="text-xl text-white/70 leading-relaxed">
            Join thousands of students who have transformed their careers 
            and landed jobs at top tech companies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="card-elevated p-8 relative group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <Quote className="w-8 h-8 text-blue-400" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 leading-relaxed mb-8 text-lg">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-white/60">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-white/10 rounded-full backdrop-blur-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-blue-600 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-white/80 text-sm">
              Join 50,000+ successful students
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}