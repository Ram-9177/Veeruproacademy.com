import { SafeImage } from './SafeImage'

import { Badge } from './Badge'

type Testimonial = {
  name: string
  role: string
  quote: string
  avatar: string
  highlight?: string
}

type Props = {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: Props) {
  return (
    <article className="group flex flex-col gap-5 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md p-6 shadow-xl shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:bg-card/70 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
      {/* Header - Avatar + Name + Badge */}
      <div className="flex items-start gap-4">
        {/* Avatar with subtle ring */}
        <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-secondary-1/30 shadow-lg shadow-secondary-1/20">
          <SafeImage
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-base font-bold text-foreground group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary-1 group-hover:bg-clip-text transition-all duration-300">
              {testimonial.name}
            </div>
            {testimonial.highlight && (
              <Badge tone="secondary-1" className="text-xs px-2 py-0.5">
                ⭐ {testimonial.highlight}
              </Badge>
            )}
          </div>
          <div className="text-sm text-secondary-3">
            {testimonial.role}
          </div>
        </div>
      </div>

      {/* Quote */}
      <p className="text-sm text-foreground/80 leading-relaxed italic">
        &quot;{testimonial.quote}&quot;
      </p>
    </article>
  )
}
