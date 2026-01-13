import { notFound, redirect } from 'next/navigation'
import { RoleKey, ContentStatus } from '@prisma/client'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

export default async function LessonPage({ params }: Props) {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    select: {
      slug: true,
      status: true,
      course: {
        select: {
          slug: true,
          status: true,
        },
      },
    },
  })

  if (!lesson) {
    return notFound()
  }

  if (lesson.status !== ContentStatus.PUBLISHED) {
    const session = await auth()
    const roles = (session?.user as { roles?: RoleKey[] } | null)?.roles ?? []
    if (!roles.includes(RoleKey.ADMIN)) {
      return notFound()
    }
  }

  if (lesson.course?.slug) {
    const target = `/courses/${lesson.course.slug}/learn?lesson=${encodeURIComponent(lesson.slug)}`
    redirect(target)
  }

  redirect(`/tutorials/${encodeURIComponent(lesson.slug)}`)
}
