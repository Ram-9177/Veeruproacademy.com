import { notFound } from 'next/navigation'

import { requireMentorOrAdmin } from '@/lib/auth-server'
import { prisma } from '@/lib/db'

import { CourseEditor } from './components/CourseEditor'

export default async function EditCoursePage({
  params,
}: {
  params: { slug: string }
}) {
  await requireMentorOrAdmin()

  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { id: params.slug },
        { slug: params.slug }
      ]
    },
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      },
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  return <CourseEditor course={course} />
}
