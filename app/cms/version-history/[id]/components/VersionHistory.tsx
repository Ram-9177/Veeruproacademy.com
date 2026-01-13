'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { CmsPageWithVersionsLite, CmsPageVersionLite } from '@/lib/cms/constants'
import { toast } from 'sonner'

interface VersionHistoryProps {
  page: CmsPageWithVersionsLite
}

export function VersionHistory({ page }: VersionHistoryProps) {
  const router = useRouter()
  const [selectedVersion, setSelectedVersion] = useState<CmsPageVersionLite | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version?')) {
      return
    }

    setIsRestoring(true)

    try {
      const res = await fetch(`/api/cms/versions/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      })

      if (!res.ok) {
        throw new Error('Failed to restore version')
      }

      toast.success('Version restored successfully')
      router.push(`/cms/pages/${page.id}`)
    } catch (error) {
      console.error('Restore error:', error)
      toast.error('Failed to restore version')
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href={`/cms/pages/${page.id}`}
            className="text-blue-400 hover:text-blue-300 mb-2 inline-block"
          >
            ← Back to Editor
          </Link>
          <h1 className="text-3xl font-bold">{page.title}</h1>
          <p className="text-gray-400 mt-1">Version History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Version List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold">Versions ({page.versions.length})</h2>
            </div>
            <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
              {page.versions.map((version) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`w-full text-left p-4 hover:bg-gray-800/50 transition-colors ${
                    selectedVersion?.id === version.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold">Version {version.version}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        version.action === 'PUBLISH'
                          ? 'bg-green-900/30 text-green-400'
                          : version.action === 'CREATE'
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {version.action}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {version.user?.name || version.user?.email || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Version Preview */}
        <div className="lg:col-span-2">
          {selectedVersion ? (
            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Version {selectedVersion.version}</h2>
                  <p className="text-sm text-gray-400">
                    {new Date(selectedVersion.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(selectedVersion.id)}
                  disabled={isRestoring}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {isRestoring ? 'Restoring...' : 'Restore Version'}
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="text-sm text-gray-400">Status</label>
                  <p className="mt-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedVersion.status === 'PUBLISHED'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      {selectedVersion.status}
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-400">Editor</label>
                  <p className="mt-1">
                    {selectedVersion.user?.name || selectedVersion.user?.email || 'Unknown'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Content Preview</label>
                  <div className="bg-gray-800 rounded-lg p-6 prose prose-invert max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (selectedVersion.data as any)?.content || '<p>No content</p>',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-400">Select a version to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
