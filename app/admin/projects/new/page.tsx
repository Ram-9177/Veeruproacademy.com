import { requireMentorOrAdmin } from '@/lib/auth-server'
import { ProjectEditor } from '../[slug]/edit/components/ProjectEditor'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  await requireMentorOrAdmin()

  const project = {
    id: null,
    title: '',
    slug: '',
    description: '',
    level: '',
    category: '',
    price: 0,
    tools: [],
    includes: [],
    driveUrl: '',
    upiId: '',
    formUrl: '',
    status: 'DRAFT',
    featured: false,
    thumbnail: '',
  }

  return <ProjectEditor project={project} />
}
