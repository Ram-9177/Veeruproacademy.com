'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CMS_STATUS, type CmsStatus as CmsStatusType, type CmsPageWithVersionsLite } from '@/lib/cms/constants'
import { toast } from 'sonner'
import { TipTapEditor } from './TipTapEditor'

interface CmsPageEditorProps {
  page: CmsPageWithVersionsLite | null
  isNew: boolean
}

export function CmsPageEditor({ page, isNew }: CmsPageEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(page?.title || '')
  const [slug, setSlug] = useState(page?.slug || '')
  const [content, setContent] = useState<string>(() => {
    if (page?.content) return page.content
    if (page?.versions?.[0]?.data) {
      return (page.versions[0].data as any).content || ''
    }
    return ''
  })
  const [status, setStatus] = useState<CmsStatusType>(page?.status || CMS_STATUS.DRAFT)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(page?.updatedAt ? new Date(page.updatedAt) : null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savingError, setSavingError] = useState<string | null>(null)

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setSlug(generatedSlug)
    }
  }, [title, slug, isNew])

  useEffect(() => {
    if (!page) return
    const initialContent = page.content ?? (page.versions?.[0]?.data as any)?.content ?? ''
    const dirty =
      title !== page.title ||
      slug !== page.slug ||
      content !== initialContent ||
      status !== page.status

    setHasUnsavedChanges(dirty)
  }, [content, page, slug, status, title])

  // Define handleSave before useEffect so it can be used in dependencies
  const handleSave = useCallback(
    async (isAutosave = false, statusOverride?: CmsStatusType) => {
      if (!title.trim() || !slug.trim()) {
        if (!isAutosave) {
          toast.error('Title and slug are required')
        }
        return
      }

      setSavingError(null)
      setIsSaving(true)

      try {
        if (isNew) {
          const res = await fetch('/api/cms/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, slug, content, status: statusOverride ?? status }),
          })

          const body = await res.json()
          if (!res.ok || !body.success) {
            throw new Error(body.error || 'Failed to create page')
          }

          toast.success('Page created successfully')
          router.push(`/cms/pages/${body.data.id}`)
          return
        }

        const res = await fetch(`/api/cms/pages/${page!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, content, status: statusOverride ?? status }),
        })

        const body = await res.json()

        if (!res.ok || !body.success) {
          throw new Error(body.error || 'Failed to save page')
        }

        if (body.data?.status) {
          setStatus(body.data.status)
        }

        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        if (!isAutosave) {
          toast.success('Page saved successfully')
        }
      } catch (error: any) {
        const errorMsg = error?.message || 'Failed to save page'
        setSavingError(errorMsg)
        if (!isAutosave) {
          toast.error(errorMsg)
        }
      } finally {
        setIsSaving(false)
      }
    },
    [title, slug, content, status, isNew, page, router]
  )

  // Autosave every 3 seconds
  useEffect(() => {
    if (!hasUnsavedChanges || isNew) return

    const timer = setTimeout(() => {
      handleSave(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [handleSave, hasUnsavedChanges, isNew])

  const handlePublishToggle = async () => {
    const newStatus = status === CMS_STATUS.PUBLISHED ? CMS_STATUS.DRAFT : CMS_STATUS.PUBLISHED
    setStatus(newStatus)
    
    if (!isNew) {
      await handleSave(false, newStatus)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/cms/pages"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">
                {isNew ? 'Create Page' : 'Edit Page'}
              </h1>
              {lastSaved && (
                <p className="text-sm text-gray-400">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </p>
              )}
              {savingError && (
                <p className="text-sm text-red-400">
                  {savingError}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isNew && (
              <Link
                href={`/cms/version-history/${page!.id}`}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Version History
              </Link>
            )}
            <button
              onClick={handlePublishToggle}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                status === CMS_STATUS.PUBLISHED
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {status === CMS_STATUS.PUBLISHED ? 'Unpublish' : 'Publish'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page Title"
              className="w-full text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 mb-4"
            />

            {/* Slug Input */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Slug {page?.isPublished && '(locked after publish)'}
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={page?.isPublished}
                placeholder="page-slug"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {slug && (
                <p className="text-sm text-gray-500 mt-1">
                  Public URL: /c/{slug}
                </p>
              )}
            </div>

            {/* TipTap Editor */}
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </div>
  )
}
