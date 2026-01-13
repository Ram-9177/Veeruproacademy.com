import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

type FAQItem = {
  id: string
  question: string
  answer: string
  emoji: string
}

const faqs: FAQItem[] = [
  {
    id: 'beginner',
    question: 'I&apos;m a complete beginner. Can I really learn to code?',
    answer: 'Absolutely! Our courses start from the very basics and build up gradually. We&apos;ve helped thousands of complete beginners become confident developers. Plus, our interactive sandbox makes learning fun and engaging!',
    emoji: '🌱'
  },
  {
    id: 'time',
    question: 'How much time do I need to dedicate to learning?',
    answer: 'You can learn at your own pace! Most students spend 1-2 hours per day and see significant progress within weeks. Our bite-sized lessons and gamified approach make it easy to stay consistent.',
    emoji: '⏰'
  },
  {
    id: 'support',
    question: 'What if I get stuck or need help?',
    answer: 'You&apos;re never alone! We have an active community, built-in hints in the sandbox, and detailed explanations for every concept. Plus, our interactive code examples help you learn by doing.',
    emoji: '💪'
  },
  {
    id: 'projects',
    question: 'Will I build real projects or just do tutorials?',
    answer: 'Real projects all the way! Every course includes hands-on projects you can add to your portfolio. Our sandbox environment lets you build, test, and deploy real applications instantly.',
    emoji: '🚀'
  },
  {
    id: 'career',
    question: 'Can this actually help me get a job in tech?',
    answer: 'Many of our students have landed their dream jobs! We focus on practical skills that employers want, provide portfolio-ready projects, and teach you how to showcase your work effectively.',
    emoji: '💼'
  }
]

export function FAQ({ singleExpand = false }: { singleExpand?: boolean }) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const isOpen = prev.includes(id)
      if (isOpen) return prev.filter(x => x !== id)
      if (singleExpand) return [id]
      return [...prev, id]
    })
  }

  const onKeyNavigate = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const focusable = itemRefs.current.filter(Boolean) as HTMLButtonElement[]
    if (focusable.length === 0) return
    const idx = focusable.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = focusable[(idx + 1) % focusable.length]
      next?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = focusable[(idx - 1 + focusable.length) % focusable.length]
      prev?.focus()
    }
  }

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="max-w-4xl mx-auto">
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.question.replace(/&apos;/g, "'"),
            acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/&apos;/g, "'") }
          }))
        })}
      </script>

      <div className="space-y-4" role="list" aria-label="Frequently asked questions" onKeyDown={onKeyNavigate}>
        {faqs.map((faq, index) => {
          const isOpen = openItems.includes(faq.id)
          return (
            <div
              key={faq.id}
              role="listitem"
              className={cn(
                'overflow-hidden border-2 rounded-xl bg-card focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200',
                isOpen
                  ? 'border-primary/40 shadow-lg'
                  : 'border-border hover:border-primary/30 shadow-sm'
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <h3 className="sr-only" id={`faq-heading-${faq.id}`}>{faq.question}</h3>
              <button
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() => toggleItem(faq.id)}
                ref={el => { itemRefs.current[index] = el }}
                className="w-full p-5 text-left flex items-center justify-between group focus:outline-none"
              >
                <span className="flex items-center gap-4">
                  <span
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300',
                      isOpen
                        ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                        : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                    )}
                    aria-hidden="true"
                  >
                    <span className="text-lg" aria-hidden="true">{faq.emoji}</span>
                  </span>
                  <span className={cn(
                    'font-medium text-base md:text-lg transition-colors duration-200',
                    isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  )}>
                    {faq.question}
                  </span>
                </span>
                <span
                  className={cn(
                    'flex-shrink-0 w-6 h-6 text-muted-foreground transition-transform duration-300',
                    isOpen ? 'text-primary rotate-180' : 'group-hover:text-primary'
                  )}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-full h-full" />
                </span>
              </button>
              <div
                id={`faq-panel-${faq.id}`}
                role="region"
                aria-labelledby={`faq-heading-${faq.id}`}
                className={cn(
                  'grid',
                  prefersReducedMotion
                    ? (isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')
                    : 'transition-all duration-300 ease-in-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-muted-foreground leading-relaxed" role="definition">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-12 p-8 glass-card rounded-2xl">
        <div className="mb-4">
          <span className="text-4xl mb-4 inline-block animate-bounce">🎯</span>
        </div>
        <h3 className="text-xl font-semibold text-primary mb-2">
          Still have questions?
        </h3>
        <p className="text-muted-foreground mb-4">
          Join our community of learners and get help from fellow students and instructors!
        </p>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-md hover:shadow-lg hover:-translate-y-0.5">
          Join the Community
        </button>
      </div>
    </div>
  )
}
