import { redirect } from 'next/navigation'


export const dynamic = 'force-dynamic'
export default function AdminPage() {
  // Redirect to unified Admin Hub for a single control surface
  redirect('/admin/hub')
}
