/**
 * FAQAccordion - Reusable FAQ accordion component
 */

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { CmsFaqItem, CmsFaqSection } from '@/lib/cms/content-types'

type FAQItemProps = {
  item: CmsFaqItem
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors group"
      >
        <span className="text-lg font-semibold text-foreground group-hover:text-primary pr-8">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <div className="text-muted-foreground leading-relaxed">{item.answer}</div>
      </div>
    </div>
  )
}

type FAQAccordionProps = {
  section: CmsFaqSection
  allowMultiple?: boolean
  className?: string
}

export function FAQAccordion({ section, allowMultiple = false, className = '' }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      )
    } else {
      setOpenItems(prev => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={className}>
      {/* Section Header */}
      {(section.title || section.description) && (
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {section.title}
            </h2>
          )}
          {section.description && (
            <p className="text-lg text-gray-600">{section.description}</p>
          )}
        </div>
      )}

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-soft border border-border divide-y divide-border">
        {section.items.map(item => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openItems.includes(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

// Alternative: Simple FAQ list without accordion
type FAQListProps = {
  items: CmsFaqItem[]
  className?: string
}

export function FAQList({ items, className = '' }: FAQListProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {items.map(item => (
        <div key={item.id} className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{item.question}</h3>
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      ))}
    </div>
  )
}
