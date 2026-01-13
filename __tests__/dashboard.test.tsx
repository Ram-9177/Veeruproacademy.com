import React from 'react'
import { render, screen } from '@testing-library/react'
import StudentDashboard from '../app/dashboard/student-dashboard'

const baseProps = {
  user: {
    id: 'user-1',
    name: 'Alex Learner',
    email: 'alex@example.com',
    avatarUrl: null,
    defaultRole: 'STUDENT',
    lastLoginAt: new Date().toISOString(),
    joinedAt: new Date('2023-01-01').toISOString(),
    status: 'ACTIVE',
  },
  stats: {
    totalCourses: 1,
    totalProjects: 1,
    totalCertificates: 1,
    overallProgress: 75,
    streakDays: 4,
  },
  courses: [
    {
      id: 'course-1',
      slug: 'fullstack-foundations',
      title: 'Fullstack Foundations',
      description: 'Learn the fundamentals of modern web development.',
      thumbnail: null,
      level: 'Beginner',
      duration: 120,
      status: 'IN_PROGRESS',
      startedAt: new Date('2023-02-01').toISOString(),
      completedLessons: 6,
      totalLessons: 10,
      progressPercent: 60,
      resumeLessonSlug: 'fullstack-foundations-html-basics',
      resumeLessonTitle: 'HTML Basics',
      updatedAt: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: 'project-1',
      slug: 'portfolio-build',
      title: 'Portfolio Build',
      category: 'Frontend',
      price: 0,
      driveUrl: null,
      thumbnail: null,
      featured: true,
      unlockedAt: new Date().toISOString(),
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      certificateNumber: 'CERT-123',
      issuedAt: new Date('2023-05-05').toISOString(),
      courseTitle: 'Fullstack Foundations',
      courseSlug: 'fullstack-foundations',
    },
  ],
  recentLessons: [
    {
      slug: 'fullstack-foundations-html-basics',
      title: 'HTML Basics',
      courseTitle: 'Fullstack Foundations',
      courseSlug: 'fullstack-foundations',
      completed: false,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    },
  ],
  recommendedLesson: {
    courseTitle: 'Fullstack Foundations',
    courseSlug: 'fullstack-foundations',
    slug: 'fullstack-foundations-html-basics',
    title: 'HTML Basics',
    order: 3,
  },
  settings: {
    onboardingState: { checklist: ['explore-courses'] },
    preferences: { theme: 'dark' },
    defaultRole: 'STUDENT',
    status: 'ACTIVE',
  },
  initialTab: 'courses' as const,
}

describe('StudentDashboard', () => {
  test('renders user greeting and learning hub', () => {
    render(<StudentDashboard {...baseProps} />)

    expect(screen.getByRole('heading', { name: /alex learner/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /your learning hub/i })).toBeInTheDocument()
    expect(screen.getByText(/Overall progress/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resume learning/i })).toBeInTheDocument()
  })

  test('shows project and certificate tabs', () => {
    render(<StudentDashboard {...baseProps} initialTab="projects" />)

    expect(screen.getByRole('tab', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /certificates/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /portfolio build/i })).toBeInTheDocument()
    expect(screen.getByText(/Fullstack Foundations/i)).toBeInTheDocument()
  })
})
