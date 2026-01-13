import React from 'react'

type Props = {
  title: string
  slug: string
  summary?: string
  tags?: string[]
}

export default function TutorialCard({ title, slug, summary, tags = [] }: Props) {
  return (
    <article className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-foreground"><a href={`/tutorials/${slug}`}>{title}</a></h3>
      {summary && <p className="mt-2 text-sm text-muted-foreground">{summary}</p>}
      {tags.length > 0 && (
        <div className="mt-3 flex gap-2">
          {tags.map(t => (
            <span key={t} className="inline-block bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      )}
    </article>
  )
}
