'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X, BookOpen, Code, FileText, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = {
  type: 'course' | 'project' | 'lesson' | 'user'
  slug: string
  title: string
  description?: string
  level?: string
  duration?: string
}

interface EnhancedSearchProps {
  open: boolean
  onClose: () => void
  placeholder?: string
}

const MIN_QUERY_LENGTH = 2
const RESULT_LIMIT = 12

export function EnhancedSearch({ open, onClose, placeholder = 'Search courses, lessons, projects...' }: EnhancedSearchProps) {
  const [results, setResults] = useState<Item[]>([])
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
      setSelectedIndex(-1)
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const term = query.trim()
    if (term.length < MIN_QUERY_LENGTH) {
      setResults([])
      setSelectedIndex(-1)
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
          setSelectedIndex(-1)
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const item = results[selectedIndex]
      if (item) {
        window.location.href = getHref(item)
        onClose()
      }
    }
  }

  const getTypeIcon = (type: Item['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />
      case 'lesson':
        return <FileText className="h-4 w-4" />
      case 'project':
        return <Code className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Enhanced search"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Search className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search input"
            className="flex-1 bg-transparent border-none outline-none text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                setSelectedIndex(-1)
                inputRef.current?.focus()
              }}
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-neutral-400" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div
          className="max-h-[60vh] overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {loading ? (
            <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
              Searching...
            </div>
          ) : showEmptyState ? (
            <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
              {showHint
                ? 'Start typing to search...'
                : 'No results found. Try different keywords.'}
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {results.map((item, index) => (
                <li key={`${item.type}-${item.slug}`}>
                  <Link
                    href={getHref(item)}
                    onClick={onClose}
                    className={cn(
                      'block px-4 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors',
                      index === selectedIndex && 'bg-emerald-50 dark:bg-emerald-900/20'
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {item.title}
                          </p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                            {item.type}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
