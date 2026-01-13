import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireMentorOrAdmin } from '@/lib/auth-server'
import { ProjectEditor } from './components/ProjectEditor'

export const dynamic = 'force-dynamic'

export default async function ProjectEditPage({ params }: { params: { slug: string } }) {
  await requireMentorOrAdmin()

  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  })

  if (!project) {
    notFound()
  }

  return <ProjectEditor project={project} />
}
