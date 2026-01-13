// Client-side progress tracking utilities (localStorage-backed)
// Safe on SSR: functions guard for window availability.

export interface LessonProgress {
  completed: boolean
  completedAt?: string
  timeSpent?: number // seconds
  lastPosition?: number // scroll position or video timestamp
}

export interface CourseProgress {
  courseSlug: string
  enrolledAt: string
  lastAccessedAt: string
  completedAt?: string
  currentLessonSlug?: string
  currentLessonTitle?: string
  lessonsCompleted: string[]
  totalLessons: number
  progressPercent: number
  timeSpentTotal: number // total seconds spent
  quizScores: Record<string, { score: number; total: number; completedAt: string }>
}

export type ProgressState = {
  lessons: Record<string, LessonProgress>
  courses: Record<string, CourseProgress>
  streakStart?: string
  lastActive?: string
  streakDays?: number
  totalXP?: number
  level?: number
}

const KEY = 'academy:progress:v2'
const LEGACY_KEY = 'academy:progress:v1'

function read(): ProgressState {
  if (typeof window === 'undefined') return { lessons: {}, courses: {} }
  try {
    let raw = window.localStorage.getItem(KEY)
    // Migrate from v1 if needed
    if (!raw) {
      const legacyRaw = window.localStorage.getItem(LEGACY_KEY)
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw)
        // Migrate old format
        const migrated: ProgressState = {
          lessons: {},
          courses: {},
          streakStart: legacy.streakStart,
          lastActive: legacy.lastActive,
          streakDays: legacy.streakDays,
          totalXP: 0,
          level: 1,
        }
        // Convert old lessons format
        Object.keys(legacy.lessons || {}).forEach(slug => {
          if (legacy.lessons[slug]) {
            migrated.lessons[slug] = {
              completed: true,
              completedAt: new Date().toISOString()
            }
          }
        })
        write(migrated)
        return migrated
      }
      return { lessons: {}, courses: {}, totalXP: 0, level: 1 }
    }
    return JSON.parse(raw)
  } catch {
    return { lessons: {}, courses: {}, totalXP: 0, level: 1 }
  }
}

function write(state: ProgressState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(state))
}

// Calculate level from XP (every 500 XP = 1 level)
function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1
}

// Update streak logic
function updateStreak(state: ProgressState): void {
  const today = new Date().toISOString().slice(0, 10)
  if (!state.streakStart) state.streakStart = today
  if (state.lastActive !== today) {
    const last = state.lastActive ? new Date(state.lastActive) : null
    const diffDays = last ? Math.round((Date.now() - last.getTime()) / 86400000) : 0
    if (diffDays === 1) {
      state.streakDays = (state.streakDays || 1) + 1
    } else if (diffDays > 1) {
      state.streakDays = 1
      state.streakStart = today
    } else if (!state.streakDays) {
      state.streakDays = 1
    }
    state.lastActive = today
  }
}

// Add XP and update level
export function addXP(amount: number): { newXP: number; newLevel: number; leveledUp: boolean } {
  const state = read()
  const oldLevel = state.level || 1
  state.totalXP = (state.totalXP || 0) + amount
  state.level = calculateLevel(state.totalXP)
  write(state)
  return {
    newXP: state.totalXP,
    newLevel: state.level,
    leveledUp: state.level > oldLevel
  }
}

// Enroll in a course
export function enrollInCourse(courseSlug: string, totalLessons: number): CourseProgress {
  const state = read()
  if (!state.courses[courseSlug]) {
    state.courses[courseSlug] = {
      courseSlug,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      lessonsCompleted: [],
      totalLessons,
      progressPercent: 0,
      timeSpentTotal: 0,
      quizScores: {}
    }
    write(state)
  }
  return state.courses[courseSlug]
}

// Update course progress
export function updateCourseProgress(
  courseSlug: string,
  currentLessonSlug: string,
  currentLessonTitle?: string
): CourseProgress | null {
  const state = read()
  const course = state.courses[courseSlug]
  if (!course) return null

  course.lastAccessedAt = new Date().toISOString()
  course.currentLessonSlug = currentLessonSlug
  if (currentLessonTitle) course.currentLessonTitle = currentLessonTitle
  
  updateStreak(state)
  write(state)
  return course
}

// Mark lesson as complete in a course
export function completeLessonInCourse(
  courseSlug: string,
  lessonSlug: string,
  timeSpent: number = 0
): { courseProgress: CourseProgress | null; isNewCompletion: boolean; isCourseComplete: boolean } {
  const state = read()
  const course = state.courses[courseSlug]
  
  if (!course) {
    return { courseProgress: null, isNewCompletion: false, isCourseComplete: false }
  }

  const isNewCompletion = !course.lessonsCompleted.includes(lessonSlug)
  
  if (isNewCompletion) {
    course.lessonsCompleted.push(lessonSlug)
    course.progressPercent = Math.round((course.lessonsCompleted.length / course.totalLessons) * 100)
    course.timeSpentTotal += timeSpent
    
    // Also mark in lessons
    state.lessons[lessonSlug] = {
      completed: true,
      completedAt: new Date().toISOString(),
      timeSpent
    }

    // Add XP for completing a lesson
    state.totalXP = (state.totalXP || 0) + 25
    state.level = calculateLevel(state.totalXP)
  }

  const isCourseComplete = course.progressPercent === 100
  if (isCourseComplete && !course.completedAt) {
    course.completedAt = new Date().toISOString()
    // Bonus XP for course completion
    state.totalXP = (state.totalXP || 0) + 500
    state.level = calculateLevel(state.totalXP)
  }

  course.lastAccessedAt = new Date().toISOString()
  updateStreak(state)
  write(state)

  return { courseProgress: course, isNewCompletion, isCourseComplete }
}

// Save quiz score
export function saveQuizScore(
  courseSlug: string,
  quizSlug: string,
  score: number,
  total: number
): { xpEarned: number; isPerfect: boolean } {
  const state = read()
  const course = state.courses[courseSlug]
  
  const isPerfect = score === total
  const percentScore = Math.round((score / total) * 100)
  const xpEarned = isPerfect ? 100 : Math.round(percentScore * 0.5)

  if (course) {
    course.quizScores[quizSlug] = {
      score,
      total,
      completedAt: new Date().toISOString()
    }
    course.lastAccessedAt = new Date().toISOString()
  }

  state.totalXP = (state.totalXP || 0) + xpEarned
  state.level = calculateLevel(state.totalXP)
  updateStreak(state)
  write(state)

  return { xpEarned, isPerfect }
}

// Update lesson scroll/video position
export function updateLessonPosition(lessonSlug: string, position: number): void {
  const state = read()
  if (!state.lessons[lessonSlug]) {
    state.lessons[lessonSlug] = { completed: false }
  }
  state.lessons[lessonSlug].lastPosition = position
  write(state)
}

// Get lesson position
export function getLessonPosition(lessonSlug: string): number | undefined {
  return read().lessons[lessonSlug]?.lastPosition
}

// Legacy function - now enhanced
export function toggleLessonComplete(lessonSlug: string): boolean {
  const state = read()
  const current = state.lessons[lessonSlug]
  
  if (current?.completed) {
    state.lessons[lessonSlug] = { completed: false }
  } else {
    state.lessons[lessonSlug] = {
      completed: true,
      completedAt: new Date().toISOString()
    }
    state.totalXP = (state.totalXP || 0) + 25
    state.level = calculateLevel(state.totalXP)
  }
  
  updateStreak(state)
  write(state)
  return state.lessons[lessonSlug].completed
}

export function isLessonComplete(lessonSlug: string): boolean {
  return !!read().lessons[lessonSlug]?.completed
}

export function getStreak() {
  const s = read()
  return { streakDays: s.streakDays || 0, streakStart: s.streakStart, lastActive: s.lastActive }
}

// Get course progress
export function getCourseProgress(courseSlug: string): CourseProgress | null {
  return read().courses[courseSlug] || null
}

// Get all enrolled courses
export function getAllEnrolledCourses(): CourseProgress[] {
  const state = read()
  return Object.values(state.courses)
}

// Get user stats
export function getUserStats(): {
  totalXP: number
  level: number
  streakDays: number
  coursesCompleted: number
  lessonsCompleted: number
  totalTimeSpent: number
} {
  const state = read()
  const coursesCompleted = Object.values(state.courses).filter(c => c.completedAt).length
  const lessonsCompleted = Object.values(state.lessons).filter(l => l.completed).length
  const totalTimeSpent = Object.values(state.courses).reduce((sum, c) => sum + c.timeSpentTotal, 0)

  return {
    totalXP: state.totalXP || 0,
    level: state.level || 1,
    streakDays: state.streakDays || 0,
    coursesCompleted,
    lessonsCompleted,
    totalTimeSpent
  }
}

// Get resume info for a course
export function getResumeInfo(courseSlug: string): {
  lessonSlug: string | null
  lessonTitle: string | null
  progressPercent: number
} | null {
  const course = read().courses[courseSlug]
  if (!course) return null
  
  return {
    lessonSlug: course.currentLessonSlug || null,
    lessonTitle: course.currentLessonTitle || null,
    progressPercent: course.progressPercent
  }
}

// Check if user is enrolled in a course
export function isEnrolled(courseSlug: string): boolean {
  return !!read().courses[courseSlug]
}

// Clear all progress (for testing)
export function clearAllProgress(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
  window.localStorage.removeItem(LEGACY_KEY)
}
