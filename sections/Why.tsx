import React from 'react'
import Container from '../components/ui/Container'
import { Stagger } from '../components/motion/Stagger'
import { GraduationCap, Globe2, Clock, Users } from 'lucide-react'
const points = [
  { icon: GraduationCap, title: 'Outcome Focused', body: 'Practical lessons framed around shipping.' },
  { icon: Users, title: 'Community Ready', body: 'Content structured for collaborative growth.' },
  { icon: Clock, title: 'Efficient Learning', body: 'Short modules; high retention visuals.' },
  { icon: Globe2, title: 'Edge Deployment', body: 'Static export optimized for instant global access.' }
]
export function Why() {
  return (
    <Container>
  <h2 className="text-2xl font-bold mb-8">Why Veeru&apos;s Pro Academy?</h2>
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {points.map(p => {
          const Icon = p.icon
          return (
            <div key={p.title} className="card p-6 bg-white/90 dark:bg-slate-800">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-100 text-indigo-600">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">{p.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{p.body}</p>
            </div>
          )
        })}
      </Stagger>
    </Container>
  )
}
export default Why
