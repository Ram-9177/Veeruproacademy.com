'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Disable scroll restoration to prevent browser from remembering scroll position
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    // Scroll to top when pathname changes
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      })
    }

    // Immediate scroll
    scrollToTop()
    
    // Also scroll after a small delay to ensure DOM is ready
    const timeoutId = setTimeout(scrollToTop, 0)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null
}