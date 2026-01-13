'use client'

import { MessageCircle } from 'lucide-react'

export function FloatingEnquiryButton() {
  return (
    <a
      href="/contact"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30"
      aria-label="Contact us for enquiries"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}