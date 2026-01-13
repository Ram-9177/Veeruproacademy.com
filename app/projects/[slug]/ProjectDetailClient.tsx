'use client'

import { useState } from 'react'
import { Badge } from '@/app/components/Badge'
import { SafeImage } from '@/app/components/SafeImage'
import { PaymentPanel } from '../PaymentPanel'
import { ProjectUnlockModal } from '@/components/ProjectUnlockModal'
import type { ProjectSummary } from '@/src/modules/projects/types'

interface ProjectDetailClientProps {
  project: ProjectSummary
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [currentProject, setCurrentProject] = useState(project)
  const [modalOpen, setModalOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleUnlock = () => {
    setBusy(true)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setBusy(false)
  }

  const handleProjectUpdate = (updated: ProjectSummary) => {
    setCurrentProject(updated)
    setBusy(false)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <section className="bg-gradient-to-br from-blue-600 to-emerald-600">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr] items-center">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {currentProject.category && (
                  <Badge tone="neutral" className="bg-white/20 text-white border-white/30">
                    {currentProject.category}
                  </Badge>
                )}
                {currentProject.level && (
                  <Badge tone="secondary-1" className="bg-white/10 text-white border-white/20">
                    {currentProject.level}
                  </Badge>
                )}
                <Badge tone={currentProject.price === 0 ? 'green' : 'gold'} className="bg-white/10 text-white border-white/20">
                  {currentProject.price === 0 ? 'Free' : `₹${currentProject.price.toLocaleString('en-IN')}`}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {currentProject.title}
              </h1>
              <p className="text-lg text-white/90">
                {currentProject.description ?? 'Build this project with guided assets and expert review.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentProject.tools.slice(0, 6).map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/20 bg-black/20">
                <SafeImage
                  src={currentProject.thumbnail ?? '/icons/image-fallback.svg'}
                  alt={currentProject.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white">About this project</h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              {currentProject.description ?? 'Detailed project brief coming soon.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white">Tools & stack</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {currentProject.tools.length > 0 ? (
                  currentProject.tools.map((tool) => (
                    <li key={tool} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {tool}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Tools will appear once added by the admin.</li>
                )}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white">What you get</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {currentProject.includes.length > 0 ? (
                  currentProject.includes.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Includes will appear once added by the admin.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <PaymentPanel project={currentProject} onUnlock={handleUnlock} busy={busy} />
        </div>
      </section>

      <ProjectUnlockModal
        project={currentProject}
        open={modalOpen}
        onClose={handleModalClose}
        onProjectUpdate={handleProjectUpdate}
        onProjectError={() => setBusy(false)}
      />
    </main>
  )
}
