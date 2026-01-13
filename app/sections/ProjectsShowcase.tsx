import { Section } from '../components/Section'
import { SectionHeader } from '../components/SectionHeader'
import { ProjectCard } from '../components/ProjectCard'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { GlassmorphicCard, FloatingBadge } from '../components/DesignPatterns'
import { ArrowRight } from 'lucide-react'
import { listProjects } from '@/src/modules/projects/service'

export async function ProjectsShowcase() {
  const { data, source } = await listProjects({}, { limit: 3 })
  const highlighted = data.slice(0, 3)
  const isStatic = source === 'static'

  return (
    <Section className="bg-background border-y border-border/50">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <FloatingBadge 
            icon={<span>🚀</span>}
            label="REAL-WORLD PROJECTS"
          />
          <SectionHeader
            eyebrow="Student projects"
            title="Launch-ready builds with assets"
            description="Pick a project, pay via UPI if it's premium, and instantly get Google Drive assets plus a review checklist."
            align="left"
          />
        </div>
        <Button
          href="/projects"
          variant="secondary-2"
          size="lg"
          icon={<ArrowRight className="h-5 w-5" />}
          className="whitespace-nowrap"
        >
          Browse All Projects
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {highlighted.map((project, idx) => (
          <div
            key={project.slug}
            className="animate-fade-in group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <GlassmorphicCard hover animated>
              <div className="p-6">
                <ProjectCard project={project} />
              </div>
            </GlassmorphicCard>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Badge tone="secondary-1" className="border-2 border-secondary-1/20 bg-secondary-1/10 text-secondary-1 font-semibold">
          ✓ UPI purchases verified manually
        </Badge>
        <Badge tone="primary" className="border-2 border-primary/20 bg-primary/10 text-primary font-semibold">
          ✓ Google Drive delivery included
        </Badge>
        <Badge tone="secondary-2" className="border-2 border-secondary-2/20 bg-secondary-2/10 text-secondary-2 font-semibold">
          ✓ Free + premium mix
        </Badge>
        {isStatic && (
          <Badge tone="neutral" className="border border-neutral-200 bg-neutral-50 text-neutral-600">
            Offline preview mode
          </Badge>
        )}
      </div>
    </Section>
  )
}
