'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/app/components/Badge'
import { Button } from '@/app/components/Button'
import { RotateCcw, User, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Version {
  id: string
  version: number
  changeNote: string | null
  createdAt: Date
  user: {
    name: string | null
    email: string | null
  } | null
  data: any
}

interface VersionHistoryListProps {
  versions: Version[]
  contentType: string
  contentId: string
}

export function VersionHistoryList({ versions, contentType, contentId }: VersionHistoryListProps) {
  const router = useRouter()
  const [restoring, setRestoring] = useState<string | null>(null)

  const handleRestore = async (versionId: string, versionData: any) => {
    if (!confirm('Are you sure you want to restore this version? This will overwrite the current content.')) {
      return
    }

    setRestoring(versionId)
    try {
      const response = await fetch(`/api/admin/${contentType.toLowerCase()}s/${contentId}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionData })
      })

      if (response.ok) {
        router.refresh()
        alert('Version restored successfully')
      } else {
        alert('Failed to restore version')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setRestoring(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="divide-y divide-neutral-200">
        {versions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No version history available</p>
          </div>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className="p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge tone="neutral">v{version.version}</Badge>
                    <span className="text-sm font-medium text-neutral-900">
                      {version.changeNote || 'No change note'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{version.user?.name || version.user?.email || 'Unknown user'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(version.id, version.data)}
                  disabled={restoring === version.id}
                  className="min-h-[44px]"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {restoring === version.id ? 'Restoring...' : 'Restore'}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

