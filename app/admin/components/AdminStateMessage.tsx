import { ReactNode } from 'react'
import { AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminStateMessageProps {
  title: string
  description: string
  tone?: 'info' | 'warning'
  actions?: ReactNode
  icon?: ReactNode
}

export function AdminStateMessage({
  title,
  description,
  tone = 'info',
  actions,
  icon
}: AdminStateMessageProps) {
  const toneStyles: Record<typeof tone, string> = {
    info: 'border-sky-200/60 bg-sky-50/60 text-sky-900',
    warning: 'border-amber-200/70 bg-amber-50/70 text-amber-900'
  }

  const IconComponent = icon ?? (tone === 'warning' ? <AlertCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />)

  return (
    <div className={cn('glass-card border-l-4 rounded-xl p-6 flex flex-col gap-3', toneStyles[tone])}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-current opacity-80">
          {IconComponent}
        </span>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-current/80">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-current/90">
            {description}
          </p>
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 pl-8 text-sm">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
