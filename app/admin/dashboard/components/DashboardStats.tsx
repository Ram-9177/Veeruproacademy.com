'use client'

import { BookOpen, FileText, FolderKanban, Users } from 'lucide-react'
import { AnimatedCounter } from '@/components/AnimatedCounter'

interface DashboardStatsProps {
  courses: number
  lessons: number
  projects: number
  users: number
}

export function DashboardStats({ courses, lessons, projects, users }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Courses',
      value: courses,
      icon: BookOpen,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      label: 'Total Lessons',
      value: lessons,
      icon: FileText,
      bgColor: 'bg-secondary-1/10',
      iconColor: 'text-secondary-1'
    },
    {
      label: 'Total Projects',
      value: projects,
      icon: FolderKanban,
      bgColor: 'bg-secondary-2/10',
      iconColor: 'text-secondary-2'
    },
    {
      label: 'Admin Users',
      value: users,
      icon: Users,
      bgColor: 'bg-secondary-3/10',
      iconColor: 'text-secondary-3'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--neutral-border))] bg-white p-8 shadow-sm transition-all duration-300 hover:bg-[hsl(var(--neutral-subtle))] hover:border-primary/40 hover:shadow-md hover:-translate-y-1 animate-slide-up flex flex-col h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-3 font-medium">{stat.label}</p>
                <p className="text-3xl font-black text-foreground mt-2 transition-colors duration-300 group-hover:text-primary">
                  <AnimatedCounter value={stat.value} />
                </p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
