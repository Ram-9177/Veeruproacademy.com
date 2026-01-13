import React from 'react'
import Container from '../components/ui/Container'
import FadeIn from '../components/motion/FadeIn'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-grid-pattern">
      <Container className="relative z-10 py-16 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[hsl(var(--neutral-border))] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-[hsl(var(--neutral-foreground))]">Welcome to Veeru&apos;s Pro Academy</span>
              </div>
            </FadeIn>
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[hsl(var(--neutral-foreground))]">
                Learn. Build. Launch.
              </h1>
            </FadeIn>
            <FadeIn>
              <p className="mt-6 text-lg sm:text-xl text-[hsl(var(--secondary-1))] leading-relaxed max-w-2xl">
                Master concepts quickly, access real project assets, and experiment safely in an interactive sandbox designed for creators.
              </p>
            </FadeIn>
            <FadeIn>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/courses"
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-8 py-4 text-base font-semibold shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Explore Courses
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-lg border border-[hsl(var(--neutral-border))] text-[hsl(var(--neutral-foreground))] px-8 py-4 text-base font-semibold bg-white transition-colors hover:bg-[hsl(var(--neutral-subtle))] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  View Projects
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { label: 'Active Learners', value: '2.3k+' },
              { label: 'Real Projects', value: '140+' },
              { label: 'Dev Tools', value: '35+' },
              { label: 'Live Sandbox', value: '24/7' }
            ].map((stat) => (
              <FadeIn key={stat.label}>
                <div className="rounded-xl bg-white border border-[hsl(var(--neutral-border))] p-6 transition-shadow hover:shadow-md shadow-sm">
                  <p className="text-3xl sm:text-4xl font-bold text-[hsl(var(--neutral-foreground))] mb-1">{stat.value}</p>
                  <p className="text-xs font-medium text-[hsl(var(--secondary-1))] uppercase tracking-wide">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Hero
