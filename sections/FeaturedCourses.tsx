import React from 'react'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Link from 'next/link'
type Course = { slug: string; title: string; description?: string }
export function FeaturedCourses({ courses = [] }: { courses?: Course[] }) {
  const list = courses.slice(0,6)
  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Featured Courses</h2>
        <Link href="/courses" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">All Courses →</Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(c => (
          <Card key={c.slug} className="p-5">
            <p className="font-semibold text-slate-800 mb-1">{c.title}</p>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">{c.description}</p>
            <Link href={`/courses/${c.slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View Course →</Link>
          </Card>
        ))}
      </div>
    </Container>
  )
}
export default FeaturedCourses
