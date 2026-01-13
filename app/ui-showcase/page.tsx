'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Users, 
  FileArchive, 
  TrendingUp,
  Search,
  FileText,
  Sparkles,
  Zap,
  Shield,
  Palette
} from 'lucide-react'
import { SkeletonCourseGrid } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { MobileCTAGroup } from '@/components/ui/MobileCTA'
import { FeatureCard, StatCard, CourseCard, ProjectCard } from '@/components/ui/EnhancedCards'
import { Card } from '@/components/ui/Card'
import { toast } from '@/components/ui/SonnerToaster'
import { Button } from '@/components/Button'
import { AttractiveBackground } from '@/app/components/AttractiveBackground'

export default function UIShowcasePage() {
  const [loading, setLoading] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  return (
    <div className="min-h-screen relative">
      <AttractiveBackground />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-emerald-600 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 shadow-lg">
              <Palette className="w-4 h-4" />
              UI/UX Showcase
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Design System Components
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Academic · Professional · Modern · Trustworthy
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative z-10">
        
        {/* Toast Notifications Demo */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Toast Notifications</h2>
          <p className="text-muted-foreground mb-8">
            User-friendly feedback messages that don&apos;t interrupt the workflow.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="primary"
              onClick={() => toast.success('Course published!', {
                description: 'Students can now enroll in your course.'
              })}
            >
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error('Failed to save', {
                description: 'Please check your connection and try again.'
              })}
            >
              Error Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('New feature available', {
                description: 'Check out the updated dashboard.'
              })}
            >
              Info Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.loading('Publishing course...')}
            >
              Loading Toast
            </Button>
          </div>
        </section>

        {/* Stat Cards */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard Stats</h2>
          <p className="text-muted-foreground mb-8">
            Data visualization cards with icons and trends.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Courses"
              value="24"
              icon={BookOpen}
              color="blue"
              trend="up"
              trendValue="+12% from last month"
            />
            <StatCard
              label="Active Students"
              value="1,234"
              icon={Users}
              color="emerald"
              trend="up"
              trendValue="+23% from last month"
            />
            <StatCard
              label="Projects"
              value="48"
              icon={FileArchive}
              color="purple"
              trend="neutral"
              trendValue="No change"
            />
            <StatCard
              label="Completion Rate"
              value="87%"
              icon={TrendingUp}
              color="orange"
              trend="up"
              trendValue="+5% from last month"
            />
          </div>
        </section>

        {/* Feature Cards */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Feature Cards</h2>
          <p className="text-muted-foreground mb-8">
            Highlighting key features with gradient backgrounds.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Fast Performance"
              description="Optimized for speed with lazy loading and code splitting."
              gradient="from-blue-50 to-cyan-50"
              iconColor="bg-blue-500"
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Trustworthy"
              description="Enterprise-grade security with role-based access control."
              gradient="from-emerald-50 to-teal-50"
              iconColor="bg-emerald-500"
            />
            <FeatureCard
              icon={Palette}
              title="Beautiful Design"
              description="Modern UI with soft shadows, smooth animations, and card layouts."
              gradient="from-purple-50 to-pink-50"
              iconColor="bg-purple-500"
            />
          </div>
        </section>

        {/* Skeleton Loaders */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Loading States</h2>
              <p className="text-muted-foreground">
                Skeleton loaders for better perceived performance.
              </p>
            </div>
            <Button onClick={handleLoadingDemo}>
              {loading ? 'Loading...' : 'Demo Loading'}
            </Button>
          </div>
          
          {loading ? (
            <SkeletonCourseGrid count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CourseCard
                title="Complete React Development"
                description="Master React from basics to advanced patterns"
                thumbnail="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400"
                level="Intermediate"
                duration="8 weeks"
                price={2999}
                href="#"
              />
              <CourseCard
                title="TypeScript Mastery"
                description="Learn TypeScript with real-world projects"
                thumbnail="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400"
                level="Advanced"
                duration="6 weeks"
                price={3999}
                href="#"
              />
              <CourseCard
                title="UI/UX Design Fundamentals"
                description="Create beautiful and functional user interfaces"
                thumbnail="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400"
                level="Beginner"
                duration="4 weeks"
                price={1999}
                href="#"
              />
            </div>
          )}
        </section>

        {/* Empty States */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Empty States</h2>
              <p className="text-muted-foreground">
                Helpful messages instead of blank screens.
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowEmpty(!showEmpty)}>
              {showEmpty ? 'Hide Empty State' : 'Show Empty State'}
            </Button>
          </div>
          
          {showEmpty ? (
            <Card className="p-0">
              <EmptyState
                icon={Search}
                title="No results found"
                description="Try adjusting your search or filters to find what you're looking for"
                action={
                  <Button onClick={() => setShowEmpty(false)}>
                    Clear Filters
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <EmptyState
                  icon={FileText}
                  title="No content yet"
                  description="Get started by creating your first course"
                  action={
                    <Button className="w-full sm:w-auto">Create Course</Button>
                  }
                />
              </Card>
              <Card>
                <EmptyState
                  icon={Sparkles}
                  title="Coming soon"
                  description="We're working on something amazing. Stay tuned!"
                />
              </Card>
            </div>
          )}
        </section>

        {/* Card Variants */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Card Layouts</h2>
          <p className="text-muted-foreground mb-8">
            Beautiful card-based layouts with soft shadows and hover effects.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card interactive variant="default" className="p-6">
              <h3 className="text-xl font-semibold mb-2">Default Card</h3>
              <p className="text-muted-foreground mb-4">
                Standard card with interactive hover effect.
              </p>
              <Button size="sm">Learn More</Button>
            </Card>
            
            <Card interactive variant="glass" className="p-6">
              <h3 className="text-xl font-semibold mb-2">Glass Card</h3>
              <p className="text-muted-foreground mb-4">
                Frosted glass effect with backdrop blur.
              </p>
              <Button size="sm" variant="outline">Learn More</Button>
            </Card>
            
            <Card interactive variant="subtle" className="p-6">
              <h3 className="text-xl font-semibold mb-2">Subtle Card</h3>
              <p className="text-muted-foreground mb-4">
                Lightweight card for secondary content.
              </p>
              <Button size="sm" variant="outline">Learn More</Button>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Typography System</h2>
          <p className="text-muted-foreground mb-8">
            Clean hierarchy with comfortable spacing and readability.
          </p>
          
          <Card className="p-8">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Display Heading
            </h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Page Title Heading
            </h2>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Section Heading
            </h3>
            <h4 className="text-xl font-semibold text-foreground mb-4">
              Subsection Heading
            </h4>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Large body text for introductions or important content. Clean sans-serif fonts provide excellent readability across all devices.
            </p>
            <p className="text-base text-foreground leading-normal mb-4">
              Standard paragraph text for regular content. Comfortable line-height ensures easy reading for longer content sections.
            </p>
            <p className="text-sm text-muted-foreground">
              Small text for metadata, captions, and secondary information.
            </p>
          </Card>
        </section>

        {/* Project Cards */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Project Cards</h2>
          <p className="text-muted-foreground mb-8">
            Showcase projects with category and difficulty badges.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="E-commerce Dashboard"
              description="Build a complete admin dashboard with React and TypeScript"
              thumbnail="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
              category="Web Development"
              difficulty="Advanced"
              href="#"
            />
            <ProjectCard
              title="Task Management App"
              description="Create a Trello-like task manager with drag and drop"
              thumbnail="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400"
              category="Full Stack"
              difficulty="Intermediate"
              href="#"
            />
            <ProjectCard
              title="Portfolio Website"
              description="Design and build a stunning personal portfolio"
              thumbnail="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400"
              category="UI/UX"
              difficulty="Beginner"
              href="#"
            />
          </div>
        </section>

        {/* Mobile CTA Demo */}
        <section className="mb-32">
          <h2 className="text-3xl font-bold text-foreground mb-6">Mobile Bottom CTA</h2>
          <p className="text-muted-foreground mb-8">
            Sticky call-to-action button on mobile for better conversion.
          </p>
          
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-emerald-50">
            <h3 className="text-2xl font-bold mb-4">Scroll down on mobile to see the sticky CTA</h3>
            <p className="text-muted-foreground mb-6">
              On desktop, the button appears inline. On mobile, it sticks to the bottom of the screen for easy access.
            </p>
            <MobileCTAGroup
              primary={
                <Button size="lg" className="w-full">
                  Learn Now - ₹2,999
                </Button>
              }
              secondary={
                <Button size="lg" variant="outline" className="w-full">
                  Try Free
                </Button>
              }
            />
          </Card>
        </section>

      </div>
    </div>
  )
}
