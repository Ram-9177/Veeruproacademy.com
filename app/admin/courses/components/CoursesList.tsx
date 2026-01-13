'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Badge } from '@/app/components/Badge'
import { useToast } from '@/lib/toast-context'

interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  status: string
  thumbnail: string | null
  createdAt: Date
  _count: {
    lessons: number
    modules: number
  }
}

interface CoursesListProps {
  courses: Course[]
}

export function CoursesList({ courses }: CoursesListProps) {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [courseItems, setCourseItems] = useState<Course[]>(courses)
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null)

  useEffect(() => {
    setCourseItems(courses)
  }, [courses])

  const filteredCourses = courseItems.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteCourse = useCallback(async (courseId: string, courseTitle: string) => {
    setDeletingCourseId(courseId)
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      setCourseItems(prev => prev.filter(course => course.id !== courseId))
      showSuccess(`Deleted ${courseTitle}`)
      router.refresh()
    } catch (error) {
      console.error('Error deleting course:', error)
      showError('Unable to delete course. Please try again.')
    } finally {
      setDeletingCourseId(null)
    }
  }, [router, showError, showSuccess])

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="p-6 border-b border-neutral-200">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      <div className="divide-y divide-neutral-200">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-neutral-500">No courses found</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="p-6 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {course.thumbnail && (
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900">{course.title}</h3>
                      <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                        {course.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge
                          tone={course.status === 'PUBLISHED' ? 'green' : 'neutral'}
                        >
                          {course.status}
                        </Badge>
                        <span className="text-xs text-neutral-500">
                          {course._count.lessons} lessons • {course._count.modules} modules
                        </span>
                        <span className="text-xs text-neutral-500">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${course.slug}`} target="_blank">
                        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                          <Eye className="h-4 w-4 text-neutral-600" />
                        </button>
                      </Link>
                      <Link href={`/admin/courses/${course.slug}/edit`}>
                        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                          <Edit className="h-4 w-4 text-neutral-600" />
                        </button>
                      </Link>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                            <MoreVertical className="h-4 w-4 text-neutral-600" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border border-neutral-200 p-2 min-w-[150px]">
                            <DropdownMenu.Item
                              className="px-3 py-2 rounded hover:bg-red-50 cursor-pointer flex items-center gap-2 text-sm text-red-600 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
                              disabled={deletingCourseId === course.id}
                              onClick={async () => {
                                if (deletingCourseId === course.id) return
                                if (confirm(`Delete "${course.title}"? This action cannot be undone.`)) {
                                  await handleDeleteCourse(course.id, course.title)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingCourseId === course.id ? 'Deleting…' : 'Delete'}
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
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

