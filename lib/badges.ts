// Client-side badge system
export interface Badge {
  id: string
  label: string
  description: string
  earnedAt: string
}

const KEY = 'academy:badges:v1'

function read(): Badge[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Badge[]
  } catch { return [] }
}

function write(badges: Badge[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(badges))
}

export function getBadges(): Badge[] { return read() }
export function hasBadge(id: string) { return read().some(b => b.id === id) }
export function awardBadge(id: string, label: string, description: string) {
  if (hasBadge(id)) return
  const badge: Badge = { id, label, description, earnedAt: new Date().toISOString() }
  write(read().concat(badge))
}

export function evaluateBadges(meta: { completedCount: number; streakDays: number }) {
  const { completedCount, streakDays } = meta
  if (completedCount === 1) awardBadge('first-lesson', 'First Lesson', 'Completed your first lesson!')
  if (streakDays >= 3) awardBadge('streak-3', '3-Day Streak', 'Maintained a 3 day learning streak.')
  if (streakDays >= 7) awardBadge('streak-7', '7-Day Streak', 'Maintained a full week learning streak.')
}
