import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { Badge } from './Badge'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  cta?: ReactNode
  className?: string
  tone?: 'default' | 'light'
  subtitle?: string
}

export function SectionHeader({ 
  eyebrow, 
  title, 
  description, 
  align = 'left', 
  cta, 
  className, 
  tone = 'default',
  subtitle
}: SectionHeaderProps) {
  const headingColor = tone === 'light' ? 'text-white' : 'text-foreground'
  const bodyColor = tone === 'light' ? 'text-white/90' : 'text-muted-foreground'
  const subtitleColor = tone === 'light' ? 'text-white/80' : 'text-muted-foreground/80'

  return (
    <div className={cn(
      'flex flex-col gap-4',
      align === 'center' ? 'text-center items-center' : '',
      className
    )}>
      {eyebrow && (
        <Badge tone={tone === 'light' ? 'secondary-1' : 'primary'} className="inline-flex w-fit">
          ✨ {eyebrow}
        </Badge>
      )}
      <div className="space-y-4">
        <h2 className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
          headingColor
        )}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn('text-lg md:text-xl font-medium', subtitleColor)}>
            {subtitle}
          </p>
        )}
        {description && (
          <p className={cn('max-w-2xl text-base md:text-lg leading-relaxed', bodyColor, align === 'center' ? 'mx-auto' : '')}>
            {description}
          </p>
        )}
      </div>
      {cta}
    </div>
  )
}
