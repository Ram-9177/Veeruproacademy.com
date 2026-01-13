import React from 'react'
import { render, screen } from '@testing-library/react'
import StudentDashboard from '../app/dashboard/student-dashboard'

const emptyStateProps = {
  user: {
    id: 'user-2',
    name: 'Jordan Student',
    email: 'jordan@example.com',
    avatarUrl: null,
    defaultRole: 'STUDENT',
    lastLoginAt: null,
    joinedAt: null,
    status: 'ACTIVE',
  },
  stats: {
    totalCourses: 0,
    totalProjects: 0,
    totalCertificates: 0,
    overallProgress: 0,
    streakDays: 0,
  },
  courses: [],
  projects: [],
  certificates: [],
  recentLessons: [],
  recommendedLesson: null,
  settings: {
    onboardingState: null,
    preferences: null,
    defaultRole: 'STUDENT',
    status: 'ACTIVE',
  },
}

describe('StudentDashboard empty states', () => {
  test('shows helpful empty state messaging when no data is present', () => {
    render(<StudentDashboard {...emptyStateProps} initialTab="projects" />)

    expect(screen.getByRole('heading', { name: /no projects unlocked/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /courses/i })).toBeInTheDocument()
  expect(screen.getByRole('tab', { name: /certificates/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /explore projects/i })).toBeInTheDocument()
  })
})
