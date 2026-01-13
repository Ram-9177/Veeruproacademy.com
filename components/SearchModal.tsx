import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Item = {
  type: 'course' | 'project' | 'lesson' | 'user'
  slug: string
  title: string
  description?: string
}

interface Props {
  open: boolean
  onClose: () => void
}

const MIN_QUERY_LENGTH = 2
const RESULT_LIMIT = 12

export default function SearchModal({ open, onClose }: Props) {
  const [results, setResults] = useState<Item[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const term = query.trim()
    if (term.length < MIN_QUERY_LENGTH) {
      setResults([])
      setLoading(false)
      return
    }

    let active = true
    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=${RESULT_LIMIT}`, {
          signal: controller.signal
        })
        if (!res.ok) {
          if (active) setResults([])
          return
        }
        const data = await res.json()
        if (active) {
          setResults(Array.isArray(data?.data) ? data.data : [])
        }
      } catch (err) {
        if (active) setResults([])
      } finally {
        if (active) setLoading(false)
      }
    }, 250)

    return () => {
      active = false
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [query, open])

  const getHref = (item: Item) => {
    switch (item.type) {
      case 'course':
        return `/courses/${item.slug}`
      case 'project':
        return `/projects/${item.slug}`
      case 'lesson':
        return `/lessons/${item.slug}`
      case 'user':
        return `/profile/${item.slug}`
      default:
        return '/search'
    }
  }

  if (!open) return null

  const showEmptyState = !loading && results.length === 0
  const showHint = query.trim().length < MIN_QUERY_LENGTH

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-deepBlue/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-auto bg-card dark:bg-neutral-900 rounded-xl shadow-xl border border-border dark:border-neutral-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, lessons, projects"
            aria-label="Search"
            className="flex-1 rounded-md border border-border dark:border-neutral-600 bg-input dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <button
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            Close
          </button>
        </div>
        <ul className="space-y-2 max-h-[50vh] overflow-y-auto">
          {loading && (
            <li className="text-sm text-muted-foreground dark:text-neutral-300">Searching...</li>
          )}
          {showEmptyState && (
            <li className="text-sm text-muted-foreground dark:text-neutral-300">
              {showHint ? 'Start typing to search...' : 'No matches.'}
            </li>
          )}
          {!loading && results.map((item) => (
            <li key={`${item.type}-${item.slug}`}>
              <Link
                onClick={onClose}
                href={getHref(item)}
                className="block rounded-md border border-border dark:border-neutral-700 bg-muted/50 dark:bg-neutral-800 px-4 py-3 hover:bg-muted dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <p className="text-sm font-semibold text-foreground dark:text-neutral-100">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground dark:text-neutral-300 mt-1 line-clamp-2">{item.description}</p>
                )}
                <span className="text-[10px] uppercase tracking-wide text-primary font-medium">{item.type}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
