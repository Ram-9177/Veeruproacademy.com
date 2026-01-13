'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, GripVertical } from 'lucide-react'
import { Badge } from '@/app/components/Badge'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  status: string
  order: number
}

interface FAQsListProps {
  faqs: FAQ[]
}

export function FAQsList({ faqs }: FAQsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="p-6 border-b border-neutral-200">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      <div className="divide-y divide-neutral-200">
        {filteredFAQs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No FAQs found</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <button className="cursor-move mt-1 text-neutral-400 hover:text-neutral-600">
                  <GripVertical className="h-5 w-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                      <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                        {faq.answer}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge
                          tone={faq.status === 'PUBLISHED' ? 'green' : 'neutral'}
                        >
                          {faq.status}
                        </Badge>
                        {faq.category && (
                          <span className="text-xs text-neutral-500">{faq.category}</span>
                        )}
                        <span className="text-xs text-neutral-500">Order: {faq.order}</span>
                      </div>
                    </div>
                    <Link href={`/admin/faqs/${faq.id}/edit`}>
                      <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Edit className="h-4 w-4 text-neutral-600" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

