import React from 'react'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Link from 'next/link'
import { Badge } from '../components/ui/Badge'
type Project = { slug: string; title: string; description?: string; price?: number }
export function FeaturedProjects({ projects = [] }: { projects?: Project[] }) {
  const list = projects.slice(0,6)
  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        <Link href="/projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">All Projects →</Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(p => (
          <Card key={p.slug} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-slate-800">{p.title}</p>
              <Badge tone={p.price ? 'accent' : 'neutral'}>{p.price ? `₹${p.price}` : 'Free'}</Badge>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">{p.description}</p>
            <Link href={`/projects/${p.slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View Project →</Link>
          </Card>
        ))}
      </div>
    </Container>
  )
}
export default FeaturedProjects
