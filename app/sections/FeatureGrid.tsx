'use client'

import { Code2, Zap, Users, Trophy, Rocket, Shield } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Learn by Building',
    description: 'Master coding through real projects, not boring theory. Build apps that solve actual problems while learning.'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Code, test, and see results immediately. Our smart editor catches errors and guides you to solutions.'
  },
  {
    icon: Users,
    title: '1-on-1 Mentorship',
    description: 'Get personalized guidance from senior developers at top tech companies. Never get stuck again.'
  },
  {
    icon: Trophy,
    title: 'Portfolio That Impresses',
    description: 'Build 10+ professional projects that make recruiters say "wow" and land you interviews.'
  },
  {
    icon: Rocket,
    title: 'Job Guarantee',
    description: 'Get hired within 6 months or get your money back. We help with resumes, interviews, and job search.'
  },
  {
    icon: Shield,
    title: 'Learn Once, Own Forever',
    description: 'Pay once, learn forever. Get all future updates, new courses, and advanced content at no extra cost.'
  }
]

export function FeatureGrid({ studentCount = 10000 }: { studentCount?: number }) {
  return (
    <section className="w3-section bg-gray-800 py-12 md:py-20">
      <div className="w3-container">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Why 95% of Our Students
            <span className="block text-blue-400 mt-2">Get Hired Within 6 Months</span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            We don&apos;t just teach code - we build careers. Our proven system combines practical skills, 
            real projects, and career support to guarantee your success in tech.
          </p>
        </div>

        {/* Features Grid - Properly Aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="w3-card p-6 md:p-8 hover:border-blue-500 transition-all duration-300 h-full flex flex-col"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-900 rounded-2xl mb-6 mx-auto">
                <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-center flex-grow text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 rounded-full text-blue-300 text-sm font-medium mb-4 max-w-full overflow-hidden">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
            <span className="truncate">Join {studentCount.toLocaleString()}+ successful students</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Start Your Journey Today
            </a>
            <a
              href="/about"
              className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}