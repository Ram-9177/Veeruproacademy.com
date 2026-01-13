'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AttractiveBackground } from '../../components/AttractiveBackground'
import { Code, Clock, CheckCircle, AlertCircle, Star, Calendar, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface UserProject {
  id: string
  title: string
  description: string
  status: 'in-progress' | 'completed' | 'submitted'
  courseSlug?: string
  submittedAt?: string
  grade?: number
}

export default function DashboardProjectsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProjects, setUserProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchUserProjects()
    }
  }, [session])

  const fetchUserProjects = async () => {
    try {
      const response = await fetch('/api/user/projects')
      if (response.ok) {
        const data = await response.json()
        setUserProjects(data)
      }
    } catch (error) {
      console.error('Error fetching user projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your projects...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    router.push('/login')
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'submitted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'submitted': return <Clock className="w-4 h-4" />
      case 'in-progress': return <AlertCircle className="w-4 h-4" />
      default: return <Code className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <AttractiveBackground />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6" />
                <h1 className="text-4xl font-bold">My Projects</h1>
              </div>
              <p className="text-xl text-white/90">
                Track your project submissions and grades
              </p>
            </div>
            <Link
              href="/projects"
              className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Browse All Projects
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {userProjects.length === 0 ? (
          <div className="text-center py-16">
            <Code className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Projects Yet</h2>
            <p className="text-white/60 mb-8">Start working on projects to build your portfolio</p>
            <Link
              href="/projects"
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project) => (
              <div key={project.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                
                <p className="text-white/70 mb-4 text-sm">
                  {project.description}
                </p>
                
                {project.courseSlug && (
                  <div className="flex items-center gap-2 mb-4 text-xs text-white/60">
                    <BookOpen className="w-3 h-3" />
                    <span>Course Project</span>
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
                  <div className="flex items-center gap-2 text-xs text-white/60 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Submitted: {new Date(project.submittedAt).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-white/10">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                  >
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}