import React from 'react'
import Container from '../components/ui/Container'
import { Stagger } from '../components/motion/Stagger'
import { Code2, Sparkles, ShieldCheck, Zap } from 'lucide-react'
const features = [
  { icon: Sparkles, title: 'Interactive MDX', subtitle: 'Rich lessons with embeds & code.' },
  { icon: Code2, title: 'Real Assets', subtitle: 'Downloadable project resources.' },
  { icon: ShieldCheck, title: 'Static Performance', subtitle: 'Instant global edge speed.' },
  { icon: Zap, title: 'Sandbox Access', subtitle: 'Experiment freely & iterate.' }
]
export function FeatureGrid() {
  return (
    <Container>
      <h2 className="text-2xl font-bold mb-8">Platform Features</h2>
      <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(f => (
          <div key={f.title} className="card p-6 bg-white/90 dark:bg-slate-800">
            <f.icon className="h-6 w-6 text-indigo-500" />
            <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">{f.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{f.subtitle}</p>
          </div>
        ))}
      </Stagger>
    </Container>
  )
}
export default FeatureGrid
