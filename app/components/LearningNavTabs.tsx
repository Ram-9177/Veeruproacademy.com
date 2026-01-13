'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

type TabKey = 'courses' | 'my-courses' | 'tutorials'

const tabConfig: Record<TabKey, { label: string; href: string }> = {
  courses: { label: 'Courses', href: '/courses' },
  'my-courses': { label: 'My Courses', href: '/my-courses' },
  tutorials: { label: 'Tutorials', href: '/tutorials' },
}

function LearningNavTabsInner() {
  const pathname = usePathname() || ''
  const tabs = Object.keys(tabConfig) as TabKey[]
  const active = tabs.find((key) => pathname.startsWith(tabConfig[key].href)) ?? 'courses'

  return (
    <nav aria-label="Learning navigation" className="w-full bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-3 md:py-4">
        {tabs.map((key) => {
          const tab = tabConfig[key]
          const isActive = active === key
          return (
            <Link
              key={key}
              href={tab.href}
              className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-foreground hover:bg-muted'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export const LearningNavTabs = memo(LearningNavTabsInner)
