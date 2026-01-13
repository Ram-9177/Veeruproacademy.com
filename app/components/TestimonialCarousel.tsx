import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Quote } from 'lucide-react'

type TestimonialProps = {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
}

const testimonials: TestimonialProps[] = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "Tech Startup",
    content: "The sandbox feature is incredible! I built my first React app and deployed it in the same day. The interactive learning kept me engaged throughout.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Student",
    company: "University",
  content: "I was struggling with JavaScript until I found Veeru's Pro Academy. The playful animations and gamified learning made coding fun instead of frustrating!",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Career Changer",
    company: "Former Marketing",
    content: "From marketing to full-stack developer in 6 months! The structured path and hands-on projects gave me the confidence to switch careers.",
    rating: 5
  }
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className={cn(
        'transition-all duration-300 transform',
        isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}>
        <div className="bg-white rounded-2xl p-8 border border-lightGray-200 shadow-lg relative overflow-hidden">
          {/* Decorative quote */}
          <div className="absolute top-4 left-6 text-emeraldGreen-200">
            <Quote className="w-12 h-12" />
          </div>
          
          {/* Floating emojis */}
          <div className="absolute top-4 right-6 opacity-60">
            <div className="flex gap-2">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>💫</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🚀</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</span>
            </div>
          </div>

          <div className="relative z-10 pt-8">
            {/* Rating stars - static 5 stars to avoid hydration mismatch */}
            <div className="flex gap-1 mb-4">
              <span className={`text-lg ${currentTestimonial.rating >= 1 ? 'text-softGold-400 animate-pulse' : 'text-lightGray-300'}`} style={{ animationDelay: '0ms' }}>⭐</span>
              <span className={`text-lg ${currentTestimonial.rating >= 2 ? 'text-softGold-400 animate-pulse' : 'text-lightGray-300'}`} style={{ animationDelay: '100ms' }}>⭐</span>
              <span className={`text-lg ${currentTestimonial.rating >= 3 ? 'text-softGold-400 animate-pulse' : 'text-lightGray-300'}`} style={{ animationDelay: '200ms' }}>⭐</span>
              <span className={`text-lg ${currentTestimonial.rating >= 4 ? 'text-softGold-400 animate-pulse' : 'text-lightGray-300'}`} style={{ animationDelay: '300ms' }}>⭐</span>
              <span className={`text-lg ${currentTestimonial.rating >= 5 ? 'text-softGold-400 animate-pulse' : 'text-lightGray-300'}`} style={{ animationDelay: '400ms' }}>⭐</span>
            </div>

            {/* Content */}
            <blockquote className="text-lg text-slate-700 leading-relaxed mb-6 font-medium italic">
              &quot;{currentTestimonial.content}&quot;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
                {currentTestimonial.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-foreground">{currentTestimonial.name}</div>
                <div className="text-sm text-muted-foreground">{currentTestimonial.role} • {currentTestimonial.company}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-300 hover:scale-125',
              index === currentIndex 
                ? 'bg-emeraldGreen-500 scale-110' 
                : 'bg-lightGray-300 hover:bg-lightGray-400'
            )}
          />
        ))}
      </div>
    </div>
  )
}
