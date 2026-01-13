'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CMS_STATUS, type CmsPageLite } from '@/lib/cms/constants'
import { toast } from 'sonner'

interface CmsPagesListProps {
  initialPages: CmsPageLite[]
}

export function CmsPagesList({ initialPages }: CmsPagesListProps) {
  const [pages, setPages] = useState(initialPages)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredPages = pages.filter((page) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'draft' && page.status !== CMS_STATUS.PUBLISHED) ||
      (filter === 'published' && page.status === CMS_STATUS.PUBLISHED)

    const matchesSearch =
      !search ||
      page.title.toLowerCase().includes(search.toLowerCase()) ||
      page.slug.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/cms/pages/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete page')
      }

      setPages((prev) => prev.filter((p) => p.id !== id))
      setDeleteId(null)
      toast.success('Page deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete page')
    }
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No pages yet</h3>
        <p className="text-gray-400 mb-6">Create your first CMS page to get started</p>
        <Link
          href="/cms/pages/new"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Create Page
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'draft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'published'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Published
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{page.title}</div>
                    {page.author && (
                      <div className="text-xs text-gray-400">
                        by {page.author.name || page.author.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
                      {page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        page.status === CMS_STATUS.PUBLISHED
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/cms/pages/${page.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(page.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-8 text-gray-400">No pages match your filters</div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-popover text-popover-foreground rounded-lg p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="text-xl font-bold mb-2">Delete Page</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this page? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
