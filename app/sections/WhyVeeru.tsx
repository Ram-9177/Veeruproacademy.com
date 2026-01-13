'use client'

import { ArrowDownToLine, Coins, Flag, Laptop, Palette } from 'lucide-react'
import { Section } from '../components/Section'
import { SectionHeader } from '../components/SectionHeader'
import { Badge } from '../components/Badge'
import { FeatureCard } from '../components/FeatureCard'
import { GlassmorphicCard, AnimatedGlow, Blob } from '../components/DesignPatterns'

const iconMap = {
  Coins: <Coins className="h-6 w-6" />,
  Download: <ArrowDownToLine className="h-6 w-6" />,
  Flag: <Flag className="h-6 w-6" />,
  Laptop: <Laptop className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />
}

const whyVeeru = [
  {
    title: 'Campus-ready documentation',
    description: 'Drive folders ship with abstracts, PPTs, review rubrics, and submission templates.',
    icon: 'Download',
    accent: 'Ready to submit'
  },
  {
    title: 'Mentor-led feedback',
    description: 'Upload proof, get reviewer notes, and iterate until your project sells your skills.',
    icon: 'Coins' // Changed to Coins as MessageSquare was mapped in data file but here iconMap uses Coins for default? Let's check iconMap
  },
  {
    title: 'Placement-focused tracks',
    description: 'Java, Python, AI, and UI/UX paths stitched to interview questions and coding rounds.',
    icon: 'Flag'
  },
  {
    title: 'Sandbox to practice',
    description: 'Run HTML/CSS/JS instantly with copy-run links that you can paste into LMS or resumes.',
    icon: 'Laptop'
  },
  {
    title: 'Clean + interactive',
    description: 'A pastel design system with motion baked in so every page looks intentional.',
    icon: 'Palette'
  }
]

export function WhyVeeru() {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-b from-background to-neutral-subtle">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedGlow />
        <Blob size="lg" color="secondary-1" delay="0s" className="absolute top-0 left-1/4 opacity-30" />
        <Blob size="md" color="secondary-2" delay="0.7s" className="absolute bottom-10 right-10 opacity-25" />
      </div>

      <div className="relative z-10">
        <SectionHeader
          eyebrow="Why Veeru Pro Academy"
          title="Everything students need to succeed"
          description="Comprehensive learning paths from fundamentals to advanced concepts. We provide clarity, practical experience, and real-world projects that prepare you for industry success."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {whyVeeru.map((item, index) => {
            const icon = iconMap[item.icon as keyof typeof iconMap] ?? <Coins className="h-6 w-6" />
            return (
              <div key={item.title} className="animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                <GlassmorphicCard hover animated>
                  <div className="p-6 h-full">
                    <FeatureCard
                      icon={icon}
                      title={item.title}
                      description={item.description}
                      accent={item.accent ? <Badge tone="secondary-2">{item.accent}</Badge> : undefined}
                      className="h-full transform transition-all duration-300"
                    />
                  </div>
                </GlassmorphicCard>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
