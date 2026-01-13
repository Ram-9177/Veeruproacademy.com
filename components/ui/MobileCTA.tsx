'use client'

import { cn } from '@/lib/utils'

interface MobileCTAProps {
  children: React.ReactNode
  className?: string
  alwaysVisible?: boolean
}

export function MobileCTA({ 
  children, 
  className,
  alwaysVisible = false 
}: MobileCTAProps) {
  return (
    <>
      {/* Desktop CTA - inline */}
      <div className={cn('hidden md:block', className)}>
        {children}
      </div>
      
      {/* Mobile CTA - sticky bottom */}
      <div className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-md border-t border-border shadow-lg md:hidden',
        alwaysVisible && 'md:block'
      )}>
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </div>
      
      {/* Spacer to prevent content from being hidden under mobile CTA */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  )
}

interface MobileCTAGroupProps {
  primary: React.ReactNode
  secondary?: React.ReactNode
  className?: string
}

export function MobileCTAGroup({ 
  primary, 
  secondary,
  className 
}: MobileCTAGroupProps) {
  return (
    <MobileCTA className={className}>
      <div className="flex gap-3">
        {secondary && (
          <div className="flex-1">
            {secondary}
          </div>
        )}
        <div className={secondary ? 'flex-1' : 'w-full'}>
          {primary}
        </div>
      </div>
    </MobileCTA>
  )
}
