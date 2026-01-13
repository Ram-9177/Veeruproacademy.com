'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, BookOpen, Code, TrendingUp, Clock, Eye, UserCheck } from 'lucide-react'

interface RealtimeEvent {
  id: string
  channel: string
  type: string
  entity: string
  payload: any
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalProjects: number
  recentActivities: RealtimeEvent[]
}


export const dynamic = 'force-dynamic'
export default function RealtimeMonitoringPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalProjects: 0,
    recentActivities: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Fetch realtime data
  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/admin/realtime-monitoring')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error fetching realtime data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchRealtimeData()
    const interval = setInterval(fetchRealtimeData, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login':
        return <UserCheck className="h-4 w-4 text-green-500" />
      case 'course_enrollment':
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'lesson_completed':
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      case 'project_started':
        return <Code className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_login':
        return 'bg-green-500/20 text-green-300'
      case 'course_enrollment':
        return 'bg-blue-500/20 text-blue-300'
      case 'lesson_completed':
        return 'bg-purple-500/20 text-purple-300'
      case 'project_started':
        return 'bg-orange-500/20 text-orange-300'
      default:
        return 'bg-gray-500/20 text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Loading realtime data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Realtime Monitoring</h1>
          <p className="text-gray-400 mt-1">Live activity dashboard for Veeru&apos;s Pro Academy</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Courses</p>
              <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {stats.recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activities</p>
              <p className="text-sm text-gray-500 mt-1">Activities will appear here as they happen</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                        {activity.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(activity.createdAt)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      {activity.type === 'user_login' && (
                        <span>
                          <strong className="text-white">{activity.payload.userName}</strong> logged in
                        </span>
                      )}
                      {activity.type === 'course_enrollment' && (
                        <span>
                          <strong className="text-white">{activity.payload.userName}</strong> enrolled in{' '}
                          <strong className="text-blue-400">{activity.payload.courseName}</strong>
                        </span>
                      )}
                      {activity.type === 'lesson_completed' && (
                        <span>
                          <strong className="text-white">{activity.payload.userName}</strong> completed{' '}
                          <strong className="text-purple-400">{activity.payload.lessonTitle}</strong>
                          {activity.payload.completionTime && (
                            <span className="text-gray-500"> in {activity.payload.completionTime}min</span>
                          )}
                        </span>
                      )}
                      {activity.type === 'project_started' && (
                        <span>
                          <strong className="text-white">{activity.payload.userName}</strong> started{' '}
                          <strong className="text-orange-400">{activity.payload.projectTitle}</strong>
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      Channel: {activity.channel} • Entity: {activity.entity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Demo Data Notice */}
      {/* Demo Data Notice - REMOVED (Now showing real data) */}
    </div>
  )
}