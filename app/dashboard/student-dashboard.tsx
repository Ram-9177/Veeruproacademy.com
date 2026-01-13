"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format, formatDistanceToNow } from 'date-fns'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { ProgressBar } from '@/components/ProgressBar'
import { OnboardingChecklist } from '@/components/OnboardingChecklist'
import { StudentStories } from '@/components/StudentStories'
import { LeaderboardWidget } from '@/components/LeaderboardWidget'

type Nullable<T> = T | null

interface StudentDashboardProps {
  user: {
    id: string
    name: Nullable<string>
    email: Nullable<string>
    avatarUrl: Nullable<string>
    defaultRole: Nullable<string>
    lastLoginAt: Nullable<string>
    joinedAt: Nullable<string>
    status: Nullable<string>
  }
  stats: {
    totalCourses: number
    totalProjects: number
    totalCertificates: number
    overallProgress: number
    streakDays: number
  }
  courses: Array<{
    id: string
    slug: string
    title: string
    description: Nullable<string>
    thumbnail: Nullable<string>
    level: Nullable<string>
    duration: Nullable<number>
    status: Nullable<string>
    startedAt: Nullable<string>
    completedLessons: number
    totalLessons: number
    progressPercent: number
    resumeLessonSlug: Nullable<string>
    resumeLessonTitle: Nullable<string>
    updatedAt: Nullable<string>
  }>
  projects: Array<{
    id: string
    slug: string
    title: string
    category: Nullable<string>
    price: number
    driveUrl: Nullable<string>
    thumbnail: Nullable<string>
    featured: boolean
    unlockedAt: string
  }>
  certificates: Array<{
    id: string
    certificateNumber: Nullable<string>
    issuedAt: string
    courseTitle: string
    courseSlug: string
  }>
  recentLessons: Array<{
    slug: string
    title: string
    courseTitle: Nullable<string>
    courseSlug: Nullable<string>
    completed: boolean
    completedAt: Nullable<string>
    updatedAt: string
  }>
  recommendedLesson: Nullable<{
    courseTitle: string
    courseSlug: string
    slug: string
    title: string
    order: number
  }>
  settings: {
    onboardingState: unknown
    preferences: unknown
    defaultRole: Nullable<string>
    status: Nullable<string>
  }
  initialTab?: 'courses' | 'projects' | 'certificates' | 'settings'
}

function formatDate(value: Nullable<string>, fallback = '—') {
  if (!value) return fallback
  try {
    return format(new Date(value), 'PP')
  } catch {
    return fallback
  }
}

function formatRelative(value: Nullable<string>) {
  if (!value) return null
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true })
  } catch {
    return null
  }
}

function initialsFromName(name: Nullable<string>) {
  if (!name) return 'ST'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return 'ST'
  const first = parts[0]?.[0] ?? ''
  const second = parts[parts.length - 1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase()
}

function SettingsSummary({
  email,
  defaultRole,
  status,
  onboardingState,
  preferences,
}: {
  email: Nullable<string>
  defaultRole: Nullable<string>
  status: Nullable<string>
  onboardingState: unknown
  preferences: unknown
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Account</h3>
        <dl className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Email</dt>
            <dd className="text-sm font-medium text-slate-800">{email ?? 'Not set'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Role</dt>
            <dd className="text-sm font-medium text-slate-800">{defaultRole ?? 'Student'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Status</dt>
            <dd className="text-sm font-medium text-slate-800 capitalize">{status?.toLowerCase() ?? 'Active'}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Onboarding</h3>
        <Card className="mt-3 p-4" variant="subtle">
          <pre className="whitespace-pre-wrap text-xs text-slate-600">
            {JSON.stringify(onboardingState ?? {}, null, 2)}
          </pre>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Preferences</h3>
        <Card className="mt-3 p-4" variant="subtle">
          <pre className="whitespace-pre-wrap text-xs text-slate-600">
            {JSON.stringify(preferences ?? {}, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  )
}

function CourseCard({
  course,
}: {
  course: StudentDashboardProps['courses'][number]
}) {
  const resumeHref = course.resumeLessonSlug ? `/lessons/${course.resumeLessonSlug}` : `/courses/${course.slug}`
  const badgeLabel = course.status ? course.status.replace(/_/g, ' ').toLowerCase() : 'enrolled'

  return (
    <Card className="p-5 h-full flex flex-col gap-4" interactive>
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-lightGray-200">
          {course.thumbnail ? (
            <Image src={course.thumbnail} alt="" fill className="object-cover" sizes="64px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
              {course.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
            <Badge variant="brand" className="capitalize">{badgeLabel}</Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{course.description ?? 'Keep the momentum going and continue your learning journey.'}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            {course.level && <span className="rounded-full bg-lightGray-100 px-3 py-1 font-medium">{course.level}</span>}
            {course.duration && <span>{course.duration} mins</span>}
            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
            {course.updatedAt && <span>Updated {formatRelative(course.updatedAt)}</span>}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <ProgressBar value={course.progressPercent} showValue aria-label={`Progress for ${course.title}`} />
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" href={resumeHref}>
            {course.resumeLessonTitle ? `Resume: ${course.resumeLessonTitle}` : 'Go to course'}
          </Button>
          <Button size="sm" variant="outline" href={`/courses/${course.slug}`}>
            View details
          </Button>
        </div>
      </div>
    </Card>
  )
}

function ProjectCard({ project }: { project: StudentDashboardProps['projects'][number] }) {
  return (
    <Card className="p-5 flex flex-col gap-4" interactive>
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-lightGray-200">
          {project.thumbnail ? (
            <Image src={project.thumbnail} alt="" fill className="object-cover" sizes="64px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
            {project.featured && <Badge variant="brand">Featured</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-600">{project.category ?? 'Capstone project'}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>Unlocked {formatDate(project.unlockedAt)}</span>
            {project.price > 0 && <span>₹{project.price.toLocaleString('en-IN')}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="sm" href={project.driveUrl ?? `/projects/${project.slug}`} target={project.driveUrl ? '_blank' : undefined}>
          {project.driveUrl ? 'Open drive link' : 'View project'}
        </Button>
        <Button size="sm" variant="outline" href={`/projects/${project.slug}`}>
          Project details
        </Button>
      </div>
    </Card>
  )
}

function CertificateCard({ certificate }: { certificate: StudentDashboardProps['certificates'][number] }) {
  return (
    <Card className="p-5 flex flex-col gap-4" interactive>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{certificate.courseTitle}</h3>
          <p className="text-sm text-slate-600">Issued {formatDate(certificate.issuedAt)}</p>
        </div>
        <Badge variant="success">Certificate</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        {certificate.certificateNumber && <span>ID: {certificate.certificateNumber}</span>}
        <span className="rounded-full bg-lightGray-100 px-3 py-1 font-medium">Share ready</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="sm" href={`/certificates/${certificate.id}`}>
          View certificate
        </Button>
        <Button size="sm" variant="outline" href={`/courses/${certificate.courseSlug}`}>
          Revisit course
        </Button>
      </div>
    </Card>
  )
}

function RecentLessonCard({
  lesson,
}: {
  lesson: StudentDashboardProps['recentLessons'][number]
}) {
  return (
    <Card className="p-4" interactive>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{lesson.title}</h4>
          {lesson.courseTitle && (
            <p className="text-xs text-slate-500">{lesson.courseTitle}</p>
          )}
        </div>
        <Badge variant={lesson.completed ? 'success' : 'neutral'}>
          {lesson.completed ? 'Completed' : 'In progress'}
        </Badge>
      </div>
      <p className="mt-3 text-xs text-slate-500">Updated {formatRelative(lesson.updatedAt) ?? formatDate(lesson.updatedAt)}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="sm" href={`/lessons/${lesson.slug}`}>
          Open lesson
        </Button>
        {lesson.courseSlug && (
          <Button size="sm" variant="outline" href={`/courses/${lesson.courseSlug}`}>
            Go to course
          </Button>
        )}
      </div>
    </Card>
  )
}

export default function StudentDashboard({
  user,
  stats,
  courses,
  projects,
  certificates,
  recentLessons,
  recommendedLesson,
  settings,
  initialTab = 'courses',
}: StudentDashboardProps) {
  const hasCourses = courses.length > 0
  const hasProjects = projects.length > 0
  const hasCertificates = certificates.length > 0
  const hasRecentLessons = recentLessons.length > 0
  const [tabValue, setTabValue] = useState<'courses' | 'projects' | 'certificates' | 'settings'>(initialTab)

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8" aria-label="Student dashboard">
      <OnboardingChecklist />

      <section className="flex flex-col gap-6 rounded-3xl bg-white border border-[hsl(var(--neutral-border))] p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-primary/20 text-lg font-semibold text-primary">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Profile avatar" fill className="object-cover" sizes="64px" />
            ) : (
              <span>{initialsFromName(user.name)}</span>
            )}
          </div>
          <div className="flex-1 min-w-[220px]">
            <p className="text-sm font-medium text-primary">Welcome back</p>
            <h1 className="text-2xl font-semibold text-slate-900">{user.name ?? 'Learner'}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {user.joinedAt && <span>Member since {formatDate(user.joinedAt)}</span>}
              {user.lastLoginAt && <span>Last active {formatRelative(user.lastLoginAt)}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-white/50 p-4 text-sm text-slate-600">
            <span className="font-semibold text-primary">Learning streak</span>
            <span className="text-2xl font-bold text-slate-900">{stats.streakDays} days</span>
            <span className="text-xs text-slate-500">Keep up the momentum!</span>
          </div>
        </div>

        {recommendedLesson && (
          <Card className="flex flex-col gap-4 p-5" variant="glass" interactive>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Next up</p>
                <h2 className="text-lg font-semibold text-slate-900">{recommendedLesson.title}</h2>
                <p className="text-sm text-slate-600">{recommendedLesson.courseTitle}</p>
              </div>
              <Badge variant="brand">Lesson {recommendedLesson.order}</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" href={`/lessons/${recommendedLesson.slug}`}>
                Resume learning
              </Button>
              <Button size="sm" variant="outline" href={`/courses/${recommendedLesson.courseSlug}`}>
                View course outline
              </Button>
            </div>
          </Card>
        )}
      </section>

      <section aria-labelledby="dashboard-stats" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5" variant="subtle">
          <h3 className="text-sm font-semibold text-slate-600">Overall progress</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.overallProgress}%</p>
          <ProgressBar className="mt-4" value={stats.overallProgress} aria-label="Overall progress" />
        </Card>
        <Card className="p-5" variant="subtle">
          <h3 className="text-sm font-semibold text-slate-600">Active courses</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalCourses}</p>
          <p className="mt-1 text-xs text-slate-500">Keep exploring new modules.</p>
        </Card>
        <Card className="p-5" variant="subtle">
          <h3 className="text-sm font-semibold text-slate-600">Projects unlocked</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalProjects}</p>
          <p className="mt-1 text-xs text-slate-500">Apply your skills in real builds.</p>
        </Card>
        <Card className="p-5" variant="subtle">
          <h3 className="text-sm font-semibold text-slate-600">Certificates earned</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalCertificates}</p>
          <p className="mt-1 text-xs text-slate-500">Share your achievements proudly.</p>
        </Card>
      </section>

      <section>
        <Tabs value={tabValue} onValueChange={(value) => setTabValue(value as typeof tabValue)} className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Your learning hub</h2>
            <TabsList>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="courses" className="mt-6">
            {hasCourses ? (
              <div className="grid gap-5 md:grid-cols-2">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses yet"
                description="Start your first course to begin learning."
                actionLabel="Browse courses"
                actionHref="/courses"
              />
            )}

            {hasRecentLessons && (
              <div className="mt-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Recent lessons</h3>
                  <Link href="/lessons" className="text-sm font-medium text-primary hover:underline">
                    View all lessons
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {recentLessons.slice(0, 4).map((lesson) => (
                    <RecentLessonCard key={lesson.slug} lesson={lesson} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            {hasProjects ? (
              <div className="grid gap-5 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No projects unlocked"
                description="Unlock a project to practise your skills end-to-end." 
                actionLabel="Explore projects"
                actionHref="/projects"
              />
            )}
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            {hasCertificates ? (
              <div className="grid gap-5 md:grid-cols-2">
                {certificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No certificates yet"
                description="Complete courses to earn shareable certificates."
                actionLabel="Find a course"
                actionHref="/courses"
              />
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsSummary
              email={user.email}
              defaultRole={settings.defaultRole}
              status={settings.status}
              onboardingState={settings.onboardingState}
              preferences={settings.preferences}
            />
          </TabsContent>
        </Tabs>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6" variant="glass">
          <h2 className="text-xl font-semibold text-slate-900">Keep the inspiration flowing</h2>
          <p className="mt-2 text-sm text-slate-600">Real stories from learners just like you.</p>
          <div className="mt-6">
            <StudentStories autoRotate={true} />
          </div>
        </Card>
        <Card className="p-6" variant="glass">
          <h2 className="text-xl font-semibold text-slate-900">Climb the leaderboard</h2>
          <p className="mt-2 text-sm text-slate-600">Stay motivated by tracking your position.</p>
          <div className="mt-6">
            <LeaderboardWidget limit={8} />
          </div>
        </Card>
      </section>
    </main>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <Card className="flex flex-col items-start gap-4 p-6 text-left" variant="outline">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
      <Button size="sm" href={actionHref}>
        {actionLabel}
      </Button>
    </Card>
  )
}
