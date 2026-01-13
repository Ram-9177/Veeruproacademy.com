import { requireAdmin } from '@/lib/auth-server'

import { NewPageEditor } from './components/NewPageEditor'

export const metadata = {
  title: 'Create Page | CMS',
  description: 'Create a new CMS page',
}


export const dynamic = 'force-dynamic'
export default async function NewCmsPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-950">
      <NewPageEditor />
    </div>
  )
}
