/**
 * Small PageHeader component for consistent page headings
 */
import React from 'react'

type Props = { title: string; subtitle?: string }

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-deepBlue">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </header>
  )
}
