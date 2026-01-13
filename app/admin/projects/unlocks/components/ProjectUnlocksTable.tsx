'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, Clock, Filter, Mail, RefreshCcw, ShieldAlert, ShieldCheck, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ProjectUnlockMetadata } from '@/src/modules/projects/types'
import { Badge } from '@/app/components/Badge'
import { Button } from '@/app/components/Button'

export type UnlockTableEntry = {
  id: string
  createdAt: string
  metadata: ProjectUnlockMetadata | null
  project: {
    id: string
    slug: string
    title: string
    thumbnail?: string | null
    driveUrl?: string | null
    price?: number | null
  } | null
  user: {
    id: string
    name: string | null
    email: string | null
  } | null
}

type FilterValue = 'all' | 'pending' | 'approved' | 'rejected'

type ProjectUnlocksTableProps = {
  initialUnlocks: UnlockTableEntry[]
}

const filters: { label: string; value: FilterValue }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
]

const statusTone: Record<FilterValue, React.ComponentProps<typeof Badge>['tone']> = {
  all: 'neutral',
  pending: 'gold',
  approved: 'green',
  rejected: 'secondary-2',
}

export function ProjectUnlocksTable({ initialUnlocks }: ProjectUnlocksTableProps) {
  const [entries, setEntries] = useState(initialUnlocks)
  const [filter, setFilter] = useState<FilterValue>('pending')
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (filter !== 'all') {
          return entry.metadata?.status === filter
        }
        return true
      })
      .filter((entry) => {
        if (!search.trim()) return true
        const query = search.trim().toLowerCase()
        const projectMatch = entry.project?.title?.toLowerCase().includes(query) || entry.project?.slug?.toLowerCase().includes(query)
        const userMatch = entry.user?.email?.toLowerCase().includes(query) || entry.user?.name?.toLowerCase().includes(query)
        return Boolean(projectMatch || userMatch)
      })
  }, [entries, filter, search])

  const refreshEntryFromPayload = (payload: any) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== payload.id) return entry
        const projectData = payload.project
          ? {
              id: payload.project.id,
              slug: payload.project.slug,
              title: payload.project.title,
              thumbnail: payload.project.thumbnail ?? null,
              driveUrl: payload.project.driveLink ?? null,
              price: payload.project.price ?? null,
            }
          : entry.project
        return {
          ...entry,
          metadata: payload.metadata ?? entry.metadata,
          project: projectData,
        }
      })
    )
  }

  const handleStatusChange = async (entryId: string, status: 'approved' | 'rejected') => {
    try {
      setActiveId(entryId)
      setFeedback(null)

      const notes = status === 'rejected' ? window.prompt('Add a rejection note (optional):') ?? '' : ''

      const response = await fetch(`/api/admin/project-unlocks/${entryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: notes.trim() || undefined }),
      })

      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? 'Action failed')
      }

      refreshEntryFromPayload(payload.data)
      setFeedback({ type: 'success', message: `Unlock marked as ${status}.` })
    } catch (error) {
      console.error('[ProjectUnlocksTable] Failed to update status', error)
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update unlock status.' })
    } finally {
      setActiveId(null)
    }
  }

  const resetFilters = () => {
    setFilter('pending')
    setSearch('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
            <Filter className="h-4 w-4" />
            Moderation queue
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  filter === option.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search by project or student"
          />
        </div>
      </div>

      {feedback && (
        <div
          className={cn(
            'rounded-xl border p-3 text-sm',
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          )}
        >
          {feedback.message}
        </div>
      )}

      {filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-500 shadow-sm">
          No unlock requests match your filters yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const status = entry.metadata?.status ?? 'pending'
            const submittedAt = entry.metadata?.submittedAt
              ? formatDistanceToNow(new Date(entry.metadata.submittedAt), { addSuffix: true })
              : formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })

            return (
              <div key={entry.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone={statusTone[status as FilterValue] ?? 'neutral'}>{status}</Badge>
                      <span className="text-xs text-neutral-500">Submitted {submittedAt}</span>
                    </div>

                    <div className="grid gap-3 text-sm text-neutral-600 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-4 w-4 text-neutral-400" />
                        <div>
                          <p className="font-semibold text-neutral-900">{entry.user?.name ?? 'Unknown student'}</p>
                          <p className="text-xs text-neutral-500">{entry.user?.email ?? 'n/a'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-4 w-4 text-neutral-400" />
                        <div>
                          <p className="font-semibold text-neutral-900">{entry.project?.title ?? 'Deleted project'}</p>
                          {entry.project?.slug && (
                            <Link href={`/projects/${entry.project.slug}`} className="text-xs text-primary underline">
                              View project page
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
                        <p className="font-semibold text-neutral-800">Payment proof</p>
                        {entry.metadata?.proofUrl ? (
                          <Link
                            href={entry.metadata.proofUrl}
                            target="_blank"
                            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-neutral-600 transition hover:bg-neutral-100"
                          >
                            <Mail className="h-4 w-4" />
                            View uploaded proof
                          </Link>
                        ) : (
                          <p className="mt-2 text-neutral-500">No proof attached yet.</p>
                        )}
                        {entry.metadata?.notes && (
                          <p className="mt-2 text-neutral-500">Notes: {entry.metadata.notes}</p>
                        )}
                      </div>
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
                        <p className="font-semibold text-neutral-800">Unlock metadata</p>
                        <p className="mt-1">Source: {entry.metadata?.source ?? 'manual'}</p>
                        <p className="mt-1">Submitted: {entry.metadata?.submittedAt ?? entry.createdAt}</p>
                        {entry.metadata?.verifiedAt && <p className="mt-1">Verified: {entry.metadata.verifiedAt}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={status === 'approved' || status === 'free' || activeId === entry.id}
                      onClick={() => handleStatusChange(entry.id, 'approved')}
                      icon={<CheckCircle2 className="h-4 w-4" />}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary-2"
                      disabled={status === 'rejected' || status === 'free' || activeId === entry.id}
                      onClick={() => handleStatusChange(entry.id, 'rejected')}
                      icon={<ShieldAlert className="h-4 w-4" />}
                    >
                      Reject
                    </Button>
                    {entry.project?.driveUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        href={entry.project.driveUrl}
                        target="_blank"
                        icon={<ShieldCheck className="h-4 w-4" />}
                      >
                        Drive link
                      </Button>
                    )}
                    {entry.metadata?.status !== 'free' && (
                      <Link href={`/admin/payment-requests?id=${entry.id}`} className="mt-1">
                        <Button size="sm" variant="ghost" className="w-full justify-start">
                          View payment request
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
