import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getProjectBySlug } from '@/src/modules/projects/service'
import { ProjectDetailClient } from './ProjectDetailClient'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  const userId = session?.user?.id ?? null

  const project = await getProjectBySlug(params.slug, { userId })

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
