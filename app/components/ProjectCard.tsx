import Link from 'next/link'
import { Download, Lock, Loader2, ShieldCheck } from 'lucide-react'

import { SafeImage } from './SafeImage'
import { Badge } from './Badge'
import { Button } from './Button'
import { formatPrice } from '@/lib/utils'
import type { ProjectSummary } from '@/src/modules/projects/types'

type Props = {
  project: ProjectSummary
  onUnlock?: () => void
  busy?: boolean
}

export function ProjectCard({ project, onUnlock, busy = false }: Props) {
  const priceLabel = project.price === 0 ? 'Free' : formatPrice(project.price)
  const imageSrc = project.thumbnail ?? '/icons/image-fallback.svg'
  const status = project.unlockStatus
  const isUnlocked = status === 'unlocked' || status === 'free'
  const isPending = status === 'pending'
  const hasDriveLink = Boolean(project.driveLink)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-border/60 shadow-lg transition-all duration-300 card-interactive glitter-box magnetic-hover glow-on-hover">
      <div className="absolute top-0 right-0 h-16 w-16 rounded-bl-3xl bg-primary/8 pointer-events-none transition-all duration-300 group-hover:bg-primary/12" />

      <div className="relative h-48 overflow-hidden bg-secondary">
        <SafeImage
          src={imageSrc}
          alt={project.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge tone={project.price === 0 ? 'green' : 'gold'} className="shadow-lg backdrop-blur-md bg-opacity-90 border-0">
            {priceLabel}
          </Badge>
          {project.level && (
            <Badge tone="neutral" className="shadow-lg backdrop-blur-md bg-background/50 text-foreground border-white/10">
              {project.level}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {project.featured && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-2 text-secondary-2-foreground shadow-lg border border-white/20">
              <span className="text-xs font-bold">💎</span>
            </div>
          )}
          <Badge
            tone={isUnlocked ? 'green' : isPending ? 'gold' : 'neutral'}
            className="shadow-lg backdrop-blur-md bg-background/60 border-white/10"
          >
            {isUnlocked ? 'Unlocked' : isPending ? 'Pending review' : 'Locked'}
          </Badge>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${project.price === 0 ? 'bg-secondary-1' : 'bg-secondary-2'} shadow-[0_0_8px_currentColor]`} />
            {project.category ?? 'Project'}
          </span>
          <span className="flex items-center gap-1.5 text-right">
            {project.tools?.slice(0, 1).join(' · ') ?? 'Creative build'}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
          {project.title}
        </h3>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
          {project.description ?? 'Launch-ready project with curated assets.'}
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.includes.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-lg bg-secondary/50 border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 group-hover:bg-secondary group-hover:text-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="group/link flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary/80"
          >
            View details
            <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
          </Link>

          {isUnlocked && hasDriveLink ? (
            <Button
              variant="outline"
              size="sm"
              href={project.driveLink ?? '#'}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/50"
              target="_blank"
            >
              <Download className="mr-1.5 h-4 w-4" />
              Assets
            </Button>
          ) : isPending ? (
            <Button variant="secondary" size="sm" disabled className="cursor-not-allowed opacity-80">
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              Verifying
            </Button>
          ) : (
            <Button
              variant="secondary-2"
              size="sm"
              onClick={onUnlock}
              href={!onUnlock ? `/projects/${project.slug}#payment` : undefined}
              className="font-bold shadow-lg"
              disabled={busy}
            >
              {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Lock className="mr-1.5 h-4 w-4" />}
              Unlock
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
