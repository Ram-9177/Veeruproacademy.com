'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Trophy, Clock, TrendingUp, User, Settings, Play, CheckCircle, Star, Calendar } from 'lucide-react'
import { AttractiveBackground } from '../components/AttractiveBackground'
import { LogoutButton } from '@/components/auth/LogoutButton'
interface EnrolledCourse {
  courseSlug: string
  progress: number
  lastAccessed: string
  completed: boolean
  certificateEarned: boolean
  course: {
    title: string
    description: string
    thumbnail: string
    lessons: any[]
    duration: string
  }
}

interface UserProject {
  id: string
  title: string
  description: string
  status: 'in-progress' | 'completed' | 'submitted'
  courseSlug?: string
  submittedAt?: string
  grade?: number
}

export default function DashboardPage() {
  const { data: sessionData, status } = useSession()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [userProjects, setUserProjects] = useState<UserProject[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  // Fetch real user data from API
  useEffect(() => {
    if (sessionData?.user) {
      fetchUserData()
    }
  }, [sessionData])

  const fetchUserData = async () => {
    try {
      // Fetch all data in parallel
      const [coursesResponse, projectsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/user/enrollments'),
        fetch('/api/user/projects'),
        fetch('/api/dashboard/analytics')
      ])

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        setEnrolledCourses(coursesData)
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setUserProjects(projectsData)
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Fallback to empty arrays
      setEnrolledCourses([])
      setUserProjects([])
      setAnalytics(null)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!sessionData?.user) {
    router.push('/login')
    return null
  }
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>
              Welcome Back, {sessionData.user.name || 'Student'}!
            </h1>
            <p className="text-lg" style={{ color: '#a1a1aa' }}>
              {sessionData.user.email}
            </p>
          </div>
          <LogoutButton variant="outline" size="md" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {analytics?.stats?.enrollments || enrolledCourses.length}
                </div>
                <div className="text-sm" style={{ color: '#a1a1aa' }}>
                  Courses Enrolled
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {analytics?.stats?.certificates || enrolledCourses.filter(c => c.certificateEarned).length}
                </div>
                <div className="text-sm" style={{ color: '#a1a1aa' }}>
                  Certificates Earned
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {analytics?.stats?.totalProjects || userProjects.length}
                </div>
                <div className="text-sm" style={{ color: '#a1a1aa' }}>
                  Projects
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                  {analytics?.stats?.avgProgress || (enrolledCourses.length > 0 ? Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length) : 0)}%
                </div>
                <div className="text-sm" style={{ color: '#a1a1aa' }}>
                  Avg Progress
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>
              Your Enrolled Courses
            </h2>
            <div className="space-y-4">
              {enrolledCourses.map((enrollment) => {
                const { course } = enrollment
                if (!course) return null
                
                return (
                  <div key={enrollment.courseSlug} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {course.thumbnail && (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {enrollment.completed && (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            )}
                            <span className="text-sm" style={{ color: '#a1a1aa' }}>
                              {enrollment.progress}%
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3" style={{ color: '#a1a1aa' }}>
                          {course.description}
                        </p>
                        
                        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              enrollment.completed ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs" style={{ color: '#a1a1aa' }}>
                            <span>Last accessed: {new Date(enrollment.lastAccessed).toLocaleDateString()}</span>
                            <span>
                              {Array.isArray(course.lessons) ? course.lessons.length : course.lessons || 0} lessons
                            </span>
                            <span>{course.duration}</span>
                          </div>
                          <Link 
                            href={`/courses/${enrollment.courseSlug}/learn`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            {enrollment.completed ? 'Review' : 'Continue'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* User Projects Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffffff' }}>
                Your Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProjects.map((project) => {
                  const courseData = enrolledCourses.find(c => c.courseSlug === project.courseSlug)?.course
                  
                  return (
                    <div key={project.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold" style={{ color: '#ffffff' }}>
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : project.status === 'submitted'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-4" style={{ color: '#a1a1aa' }}>
                        {project.description}
                      </p>
                      
                      {courseData && (
                        <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: '#a1a1aa' }}>
                          <BookOpen className="w-3 h-3" />
                          <span>From: {courseData.title}</span>
                        </div>
                      )}
                      
                      {project.grade && (
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-semibold text-yellow-400">
                            Grade: {project.grade}%
                          </span>
                        </div>
                      )}
                      
                      {project.submittedAt && (
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#a1a1aa' }}>
                          <Calendar className="w-3 h-3" />
                          <span>Submitted: {new Date(project.submittedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View Project →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/dashboard/courses" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span style={{ color: '#ffffff' }}>My Courses</span>
                </Link>
                <Link href="/dashboard/projects" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                  <span style={{ color: '#ffffff' }}>My Projects</span>
                </Link>
                <Link href="/courses" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span style={{ color: '#ffffff' }}>Browse Courses</span>
                </Link>
                <Link href="/projects" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <span style={{ color: '#ffffff' }}>All Projects</span>
                </Link>
                <Link href="/profile" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <User className="w-5 h-5 text-cyan-400" />
                  <span style={{ color: '#ffffff' }}>Edit Profile</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Settings className="w-5 h-5 text-pink-400" />
                  <span style={{ color: '#ffffff' }}>Settings</span>
                </Link>
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>
                Recent Achievements
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-300">
                      Course Completed
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200">
                    HTML & CSS Basics
                  </div>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">
                      New Skill Unlocked
                    </span>
                  </div>
                  <div className="text-xs text-blue-200">
                    JavaScript Programming
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
