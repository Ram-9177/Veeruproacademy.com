import React, { useState } from 'react'
import Container from '../components/ui/Container'
import { Button } from '../components/ui/Button'
export function Newsletter() {
  const [email,setEmail] = useState('')
  return (
    <Container>
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-10">
        <h2 className="text-2xl font-bold">Stay in the Loop</h2>
        <p className="mt-2 text-indigo-100 max-w-md">Subscribe for new course drops, project assets and sandbox upgrades.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-4 max-w-lg" onSubmit={(e)=>{e.preventDefault(); setEmail('')}}>
          <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="you@example.com" className="flex-1 rounded-lg bg-white text-slate-800 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400" />
          <Button type="submit" variant="accent" size="md">Subscribe</Button>
        </form>
      </div>
    </Container>
  )
}
export default Newsletter
