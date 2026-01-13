'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Eye, Video } from 'lucide-react'
import { Badge } from '@/app/components/Badge'

interface Lesson {
  id: string
  slug: string
  title: string
  description: string | null
  status: string
  youtubeUrl: string | null
  course: { title: string; slug: string } | null
  module: { title: string } | null
  createdAt: string
}

interface LessonsListProps {
  lessons: Lesson[]
}

export function LessonsList({ lessons }: LessonsListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-neutral-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="p-6 border-b border-neutral-200 dark:border-gray-800">
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none transition-colors"
        />
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-gray-800">
        {filteredLessons.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400">No lessons found</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="p-6 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{lesson.title}</h3>
                        {lesson.youtubeUrl && (
                          <Video className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                        {lesson.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <Badge
                          tone={lesson.status === 'PUBLISHED' ? 'green' : 'neutral'}
                        >
                          {lesson.status}
                        </Badge>
                        {lesson.course && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Course: {lesson.course.title}
                          </span>
                        )}
                        {lesson.module && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            Module: {lesson.module.title}
                          </span>
                        )}
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(lesson.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/lessons/${lesson.slug}`} target="_blank">
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 border border-transparent dark:border-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Eye className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                        </button>
                      </Link>
                      <Link href={`/admin/lessons/${lesson.id}/edit`}>
                        <button className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800 border border-transparent dark:border-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
