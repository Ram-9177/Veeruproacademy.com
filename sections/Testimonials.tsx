import React from 'react'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
const data = [
  { name: 'Aarav', role: 'Student', quote: 'The sandbox helped me prototype ideas super fast.' },
  { name: 'Isha', role: 'Frontend Dev', quote: 'Projects gave me deployable examples for interviews.' },
  { name: 'Rohan', role: 'Learner', quote: 'Bite-sized lessons improved my consistency.' }
]
export function Testimonials() {
  return (
    <Container>
      <h2 className="text-2xl font-bold mb-8">What learners say</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map(t => (
          <Card key={t.name} className="p-6">
            <p className="text-sm text-slate-600 mb-4">“{t.quote}”</p>
            <p className="text-sm font-semibold text-slate-800">{t.name}</p>
            <p className="text-xs text-slate-500">{t.role}</p>
          </Card>
        ))}
      </div>
    </Container>
  )
}
export default Testimonials
