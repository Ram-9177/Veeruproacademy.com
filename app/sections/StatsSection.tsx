'use client'

import { Section } from '../components/Section'
import { Send, Star, Sparkles } from 'lucide-react'

export function StatsSection() {
  const stats = [
    { number: '25+', label: 'Years of Experience', icon: '🎓' },
    { number: '6,500+', label: 'Class Completed', icon: '📚' },
    { number: '100+', label: 'Expert Instructors', icon: '👨‍🏫' },
    { number: '6,561+', label: 'Students Enrolled', icon: '🧑‍🎓' },
  ]

  return (
    <Section className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-teal-600 py-20 overflow-hidden">
      {/* Modern Gaussian Blur Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Paper airplane decoration */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 animate-float">
          <Send className="w-20 h-20 text-white/15 transform -rotate-45" />
        </div>
        
        {/* Large blur blob - left */}
        <div className="absolute -left-24 -top-24 w-[300px] h-[300px] rounded-full bg-white/30 blur-3xl blur-shape animate-blob" />
        
        {/* Blur blob - right */}
        <div className="absolute -right-20 -bottom-20 w-[280px] h-[280px] rounded-full bg-white/25 blur-3xl blur-shape animate-blob-delayed" />
        
        {/* Cyan accent blob - center */}
        <div className="absolute top-1/3 right-1/3 w-[200px] h-[200px] rounded-full bg-cyan-300/30 blur-2xl blur-shape opacity-60 animate-float" />
        
        {/* Floating stars */}
        <Star className="absolute top-10 left-1/3 w-5 h-5 text-amber-300/40 fill-current animate-float" />
        <Sparkles className="absolute bottom-12 right-1/4 w-6 h-6 text-yellow-300/30 animate-float-delayed" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-teal-600/30 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {stat.icon}
              </div>
              {/* Number */}
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                {stat.number}
              </div>
              {/* Label */}
              <div className="text-white/90 font-medium text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
