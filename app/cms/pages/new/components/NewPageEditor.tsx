'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CMS_STATUS, type CmsStatus as CmsStatusType } from '@/lib/cms/constants'
import { toast } from 'sonner'

import { TipTapEditor } from '../../[id]/components/TipTapEditor'

const AUTOSAVE_MS = 1500

type DraftResponse = {
  success: boolean
  error?: string
  data?: {
    id: string
    title: string
    slug: string
    status: CmsStatusType
    updatedAt?: string
  }
}

export function NewPageEditor() {
  const router = useRouter()
  const [pageId, setPageId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<CmsStatusType>(CMS_STATUS.DRAFT)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const canPublish = useMemo(() => Boolean(title.trim() && slug.trim() && content.trim()), [title, slug, content])

  // Auto-generate slug from title when empty
  useEffect(() => {
    if (!slug && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(generated)
    }
  }, [slug, title])

  const saveDraft = useCallback(
    async (isAutosave = false) => {
      if (!title.trim() && !content.trim()) {
        setHasUnsavedChanges(false)
        return null
      }

      setIsSaving(true)

      try {
        const response = await fetch('/api/cms/save-draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: pageId ?? undefined,
            title,
            slug: slug || undefined,
            content,
          }),
        })

        const data: DraftResponse = await response.json()

        if (!response.ok || !data.success || !data.data) {
          throw new Error(data.error || 'Unable to save draft')
        }

        setPageId(data.data.id)
        setSlug(data.data.slug)
        setStatus(data.data.status)
        setHasUnsavedChanges(false)
        setLastSavedAt(new Date(data.data.updatedAt || Date.now()))

        if (!isAutosave) {
          toast.success('Draft saved')
        }

        return data.data.id
      } catch (error: any) {
        console.error('Draft save failed', error)
        if (!isAutosave) {
          toast.error(error.message || 'Failed to save draft')
        }
        return null
      } finally {
        setIsSaving(false)
      }
    },
    [content, pageId, slug, title]
  )

  // Autosave draft after user stops typing
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timer = setTimeout(() => {
      saveDraft(true)
    }, AUTOSAVE_MS)

    return () => clearTimeout(timer)
  }, [hasUnsavedChanges, saveDraft])

  const handlePublish = async () => {
    const ensuredId = pageId || (await saveDraft(true))
    if (!ensuredId) {
      toast.error('Add a title before publishing')
      return
    }

    setIsPublishing(true)

    try {
      const response = await fetch('/api/cms/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ensuredId,
          title,
          slug,
          content,
          publish: true,
        }),
      })

      const data: DraftResponse = await response.json()

      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Unable to publish page')
      }

      setStatus(CMS_STATUS.PUBLISHED)
      setHasUnsavedChanges(false)
      toast.success('Page published')
      router.replace(`/cms/pages/${data.data.id}`)
      router.refresh()
    } catch (error: any) {
      console.error('Publish failed', error)
      toast.error(error.message || 'Failed to publish page')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasUnsavedChanges(true)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cms/pages" className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Create Page</h1>
              {lastSavedAt && (
                <p className="text-sm text-gray-400">
                  Last saved {lastSavedAt.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => saveDraft(false)}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving…' : 'Save draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !canPublish}
              className="px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setHasUnsavedChanges(true)
              }}
              placeholder="Page Title"
              className="w-full text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 mb-4"
            />

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Slug (public URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setHasUnsavedChanges(true)
                }}
                placeholder="page-slug"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              />
              {slug && (
                <p className="text-sm text-gray-500 mt-1">
                  Public URL: /c/{slug}
                </p>
              )}
            </div>

            <TipTapEditor content={content} onChange={handleContentChange} />

            <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
              <span>Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  status === CMS_STATUS.PUBLISHED
                    ? 'bg-green-900/40 text-green-400'
                    : 'bg-yellow-900/40 text-yellow-400'
                }`}
              >
                {status}
              </span>
              {hasUnsavedChanges && <span className="text-blue-300">Autosaving…</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
