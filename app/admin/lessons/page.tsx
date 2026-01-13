import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@/app/components/Button'
import { requireMentorOrAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'

import { AdminStateMessage } from '../components/AdminStateMessage'
import { LessonsList } from './components/LessonsList'

type LessonsListData = Array<{
  id: string
  slug: string
  title: string
  description: string | null
  status: string
  youtubeUrl: string | null
  course: { title: string; slug: string } | null
  module: { title: string } | null
  createdAt: string
}>


export const dynamic = 'force-dynamic'
export default async function LessonsPage() {
  await requireMentorOrAdmin()

  type LessonRecord = {
    id: string
    slug: string
    title: string
    description: string | null
    status: string
    youtubeUrl: string | null
    createdAt: Date
    course: { title: string; slug: string } | null
    module: { title: string } | null
  }

  let lessons: LessonRecord[] = []
  let databaseUnavailable = false

  try {
    lessons = (await prisma.lesson.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: { title: true, slug: true }
        },
        module: {
          select: { title: true }
        }
      }
    })) as LessonRecord[]
  } catch (error) {
    databaseUnavailable = true
    console.error('[admin-lessons] Failed to fetch lessons', error)
  }

  const serializedLessons: LessonsListData = lessons.map((lesson) => ({
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description ?? null,
    status: lesson.status,
    youtubeUrl: lesson.youtubeUrl ?? null,
    course: lesson.course ? { title: lesson.course.title, slug: lesson.course.slug } : null,
    module: lesson.module ? { title: lesson.module.title } : null,
    createdAt: lesson.createdAt.toISOString()
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Lessons</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-1">Manage all lessons and their content</p>
        </div>
        <Link href="/admin/lessons/new">
          <Button variant="primary" className="flex items-center gap-2 shadow-card-hover">
            <Plus className="h-4 w-4" />
            New Lesson
          </Button>
        </Link>
      </div>

      {databaseUnavailable ? (
        <AdminStateMessage
          tone="warning"
          title="Lessons unavailable"
          description="We couldn’t load lessons because the database connection failed. Configure DATABASE_URL and rerun the Prisma migrations to unlock the editor."
          actions={
            <Link href="/admin-help#database" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/80 text-foreground shadow-sm hover:bg-white">
              Database checklist
            </Link>
          }
        />
      ) : (
        <LessonsList lessons={serializedLessons} />
      )}
    </div>
  )
}
