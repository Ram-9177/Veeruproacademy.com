/**
 * Top navigation with simple search and links
 */
import React, { useState, useEffect } from 'react'
import { subscribe } from '@/lib/events'
import { getStreak } from '@/lib/progress'
import Link from 'next/link'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [streak, setStreak] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    // initialize from progress store
    try {
      const raw = localStorage.getItem('academy:progress:v1')
      if (raw) {
        const data = JSON.parse(raw)
        const lessons = data.lessons || {}
        setCompletedCount(Object.values(lessons).filter(Boolean).length)
      }
      setStreak(getStreak().streakDays || 0)
  } catch (_err) { /* ignore initial progress read error */ }
    // subscribe to lesson events to update counts live
    const unsub1 = subscribe('lesson:toggleComplete', () => {
      try {
        const raw = localStorage.getItem('academy:progress:v1')
        if (raw) {
          const data = JSON.parse(raw)
          const lessons = data.lessons || {}
          setCompletedCount(Object.values(lessons).filter(Boolean).length)
          setStreak(getStreak().streakDays || 0)
        }
  } catch (_err) { /* ignore progress refresh error */ }
    })
    const unsub2 = subscribe('lesson:autoComplete', () => {
      try {
        const raw = localStorage.getItem('academy:progress:v1')
        if (raw) {
          const data = JSON.parse(raw)
          const lessons = data.lessons || {}
          setCompletedCount(Object.values(lessons).filter(Boolean).length)
          setStreak(getStreak().streakDays || 0)
        }
  } catch (_err) { /* ignore progress refresh error */ }
    })
    return () => { unsub1(); unsub2() }
  }, [])

  useEffect(() => {
    // lock body scroll when menu is open
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav aria-label="Main Navigation" className="relative">
      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-4">
        <li>
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground">Courses</Link>
        </li>
        <li>
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
        </li>
        <li>
          <Link href="/sandbox" className="btn btn-primary">Sandbox</Link>
        </li>
        <li>
          <Link href="/admin" className="text-sm text-primary">Admin</Link>
        </li>
        <li aria-label="Learning progress" className="ml-2">
          <div className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-muted border border-border">
            <span>🔥 {streak}</span>
            <span className="text-muted-foreground">✓ {completedCount}</span>
          </div>
        </li>
        {process.env.NODE_ENV !== 'production' && (
          <li>
            <Link href="/design-system" className="text-sm text-muted-foreground">Design System</Link>
          </li>
        )}
      </ul>

      {/* Mobile: hamburger */}
      <div className="md:hidden flex items-center">
        <button
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen(!open)}
          className="p-2 rounded"
        >
          <span className="sr-only">Open main menu</span>
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
      </div>

      {/* Slide-in drawer for mobile */}
      <div
        id="mobile-drawer"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 w-72 bg-card shadow-xl transform transition-transform duration-300 z-50 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className="text-lg font-bold text-foreground">Menu</div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">✕</button>
        </div>
        <div className="p-4">
          <ul className="flex flex-col gap-3">
            <li>
              <Link href="/courses" className="block py-2 px-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Courses</Link>
            </li>
            <li>
              <Link href="/dashboard" className="block py-2 px-2 rounded hover:bg-muted" onClick={() => setOpen(false)}>Dashboard</Link>
            </li>
            <li>
              <Link href="/sandbox" className="block py-2 px-2 rounded btn btn-primary text-center" onClick={() => setOpen(false)}>Sandbox</Link>
            </li>
            <li>
              <Link href="/admin" className="block py-2 px-2 rounded text-primary text-center" onClick={() => setOpen(false)}>Admin</Link>
            </li>
            <li aria-label="Learning progress" className="px-2 py-1">
              <div className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-muted border border-border">
                <span>🔥 {streak}</span>
                <span className="text-muted-foreground">✓ {completedCount}</span>
              </div>
            </li>
            {process.env.NODE_ENV !== 'production' && (
              <li>
                <Link href="/design-system" className="block py-2 px-2 rounded text-center text-muted-foreground" onClick={() => setOpen(false)}>Design System</Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Overlay when drawer open */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setOpen(false)} aria-hidden />}
    </nav>
  )
}
