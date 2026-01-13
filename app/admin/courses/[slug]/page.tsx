import { redirect } from 'next/navigation'

export default function CoursePage({ params }: { params: { slug: string } }) {
  // Redirect to edit page by default for now
  redirect(`/admin/courses/${params.slug}/edit`)
}
