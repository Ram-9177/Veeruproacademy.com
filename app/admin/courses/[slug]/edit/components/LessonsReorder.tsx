'use client'

import { useState } from 'react'
import { DragDropReorder } from '@/components/DragDropReorder'
import { Edit } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/app/components/Badge'

interface Lesson {
  id: string
  slug: string
  title: string
  order: number
  status: string
}

interface LessonsReorderProps {
  lessons: Lesson[]
  onReorder: (_lessons: Lesson[]) => Promise<void>
}

export function LessonsReorder({ lessons, onReorder }: LessonsReorderProps) {
  const [saving, setSaving] = useState(false)

  const handleReorder = async (updatedLessons: Lesson[]) => {
    setSaving(true)
    try {
      await onReorder(updatedLessons)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Lessons</h2>
        {saving && (
          <span className="text-sm text-neutral-500">Saving order...</span>
        )}
      </div>

      <DragDropReorder
        items={lessons}
        onReorder={handleReorder}
        renderItem={(lesson, index) => (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-500 w-8">
                #{index + 1}
              </span>
              <div>
                <h3 className="font-medium text-neutral-900">{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    tone={lesson.status === 'PUBLISHED' ? 'green' : 'neutral'}
                    className="text-xs"
                  >
                    {lesson.status}
                  </Badge>
                  <span className="text-xs text-neutral-500">{lesson.slug}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/lessons/${lesson.slug}/edit`}>
                <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Edit className="h-4 w-4 text-neutral-600" />
                </button>
              </Link>
            </div>
          </div>
        )}
      />
    </div>
  )
}

