/**
 * ProjectCard - Reusable component for displaying project information
 * Used across homepage, projects page, and project listings
 */

import Image from 'next/image'
import Link from 'next/link'
import { Lock, Download } from 'lucide-react'
import type { CmsProjectCard } from '@/lib/cms/content-types'

type ProjectCardProps = {
  project: CmsProjectCard
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1 ${className}`}>
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={project.image.url}
          alt={project.image.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge Overlay */}
        {project.badge && (
          <div className="absolute top-4 left-4">
            <span className={`badge ${getBadgeVariantClass(project.badge.variant)}`}>
              {project.badge.label}
            </span>
          </div>
        )}
        
        {/* Lock Overlay */}
        {project.isLocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="w-8 h-8 text-white/80" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-4 right-4">
          <span className="badge bg-background/80 text-foreground border-border backdrop-blur-sm">
            {project.type}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6 space-y-4">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2">
          <span className={`badge ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md"
              >
                {tech.name}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md">
                +{project.techStack.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <ul className="space-y-2">
            {project.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Pricing and Actions */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {project.price}
            </span>
            {project.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {project.originalPrice}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {project.ctaLink ? (
              <Link href={project.ctaLink} className="flex-1">
                <button className="btn btn-primary w-full">
                  {project.ctaLabel || 'View Details'}
                </button>
              </Link>
            ) : (
              <Link href={`/projects/${project.slug}`} className="flex-1">
                <button className="btn btn-primary w-full">
                  View Details
                </button>
              </Link>
            )}
            
            {project.assetsLink && !project.isLocked && (
              <a
                href={project.assetsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Assets
              </a>
            )}
          </div>

          {/* UPI Payment Info */}
          {project.upiPayment && (
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <p className="font-medium text-foreground">Payment via UPI:</p>
              <p>Pay {project.price} to <span className="font-mono text-accent-foreground">{project.upiPayment.merchantId}</span></p>
              <p className="text-muted-foreground/80 mt-1">{project.upiPayment.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'intermediate':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'advanced':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

function getBadgeVariantClass(variant?: string): string {
  switch (variant) {
    case 'success':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'error':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-blue-50 text-primary border-blue-200'
  }
}
