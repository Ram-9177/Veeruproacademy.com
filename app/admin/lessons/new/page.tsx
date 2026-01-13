import { requireMentorOrAdmin } from '@/lib/auth-server'
import { LessonEditor } from '../components/LessonEditor'
import { prisma } from '@/lib/db'


export const dynamic = 'force-dynamic'
export default async function NewLessonPage() {
  await requireMentorOrAdmin()

  const courses = await prisma.course.findMany({
    select: { id: true, title: true, slug: true }
  })

  // Create empty lesson object for new lesson
  const newLesson = {
    id: '',
    slug: '',
    title: '',
    description: null,
    body: null,
    youtubeUrl: null,
    estimatedMinutes: null,
    difficulty: null,
    courseId: null,
    moduleId: null,
    status: 'DRAFT' as const,
    order: 0,
    publishedAt: null,
    scheduledAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    course: null,
    module: null
  }

  return <LessonEditor lesson={newLesson} courses={courses} />
}



