'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, MessageCircle } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { cn } from '@/lib/utils'

interface StickyActionBarProps {
  showScrollTop?: boolean
  showHelp?: boolean
  helpHref?: string
  className?: string
}

export function StickyActionBar({ 
  showScrollTop = true, 
  showHelp = true,
  helpHref = '/admin-help',
  className 
}: StickyActionBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        'fixed bottom-6 right-6 z-40 flex flex-col gap-2',
        className
      )}
      role="complementary"
      aria-label="Quick actions"
    >
      {showScrollTop && (
        <Button
          variant="primary"
          size="sm"
          onClick={scrollToTop}
          className="rounded-full p-3 shadow-lg hover:shadow-xl transition-all min-h-[48px] min-w-[48px]"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      
      {showHelp && (
        <Button
          variant="outline"
          size="sm"
          href={helpHref}
          className="rounded-full p-3 shadow-lg hover:shadow-xl transition-all min-h-[48px] min-w-[48px] bg-card"
          aria-label="Get help"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

