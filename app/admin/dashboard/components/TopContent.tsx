'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface TopContentProps {
  courses: Array<{
    id: string
    title: string
    slug: string
    status: string
  }>
}

export function TopContent({ courses }: TopContentProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md p-8 shadow-xl shadow-primary/5 hover:border-primary/30 hover:bg-card/70 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-foreground">Recent Courses</h2>
        <Link 
          href="/admin/courses"
          className="text-sm font-medium text-primary hover:text-secondary-1 flex items-center gap-1 transition-colors duration-300 hover:-translate-x-0.5"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-4 flex-1">
        {courses.length === 0 ? (
          <p className="text-sm text-secondary-3 text-center py-12">No courses yet</p>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/courses/${course.slug}`}
              className="group block p-4 rounded-lg border border-border/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-300 hover:-translate-y-0.5"
            >
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{course.title}</p>
              <p className="text-xs text-secondary-3 mt-2">{course.status}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

