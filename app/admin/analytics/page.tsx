'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, BookOpen, DollarSign, Eye } from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Legend
} from 'recharts'

interface AdminAnalytics {
  overview: {
    totalUsers: number
    totalCourses: number
    totalEnrollments: number
    totalProjects: number
    activeUsers: number
    monthlyRevenue: number
  }
  recentActivity: Array<{
    id: string
    userName: string
    userEmail: string
    courseTitle: string
    courseSlug: string
    enrolledAt: string
    progress: number
  }>
  popularCourses: Array<{
    title: string
    slug: string
    enrollments: number
  }>
}

interface ChartData {
  date: string
  revenue: number
  users: number
  enrollments: number
}

export const dynamic = 'force-dynamic'

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/analytics/charts')
        ])

        if (statsRes.ok) {
          const data = await statsRes.json()
          setAnalytics(data)
        }
        
        if (chartsRes.ok) {
          const json = await chartsRes.json()
          if (json.chartData) {
            setChartData(json.chartData)
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { 
      label: 'Monthly Revenue', 
      value: `₹${analytics?.overview.monthlyRevenue?.toLocaleString() || '0'}`, 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'emerald' 
    },
    { 
      label: 'Active Users', 
      value: analytics?.overview.activeUsers?.toLocaleString() || '0', 
      change: '+8.2%', 
      icon: Users, 
      color: 'blue' 
    },
    { 
      label: 'Total Courses', 
      value: analytics?.overview.totalCourses?.toLocaleString() || '0', 
      change: '+15.3%', 
      icon: BookOpen, 
      color: 'purple' 
    },
    { 
      label: 'Total Enrollments', 
      value: analytics?.overview.totalEnrollments?.toLocaleString() || '0', 
      change: '+22.1%', 
      icon: Eye, 
      color: 'orange' 
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="w3-section bg-blue-600">
        <div className="w3-container text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
            <BarChart3 className="w-4 h-4" />
            Analytics Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Analytics</h1>
          <p className="text-xl text-white/90">
            Track your platform&apos;s performance, user engagement, and revenue metrics.
          </p>
        </div>
      </div>

      <div className="w3-container py-12 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="w3-card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="w3-card min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => [`₹${typeof value === 'number' ? value.toLocaleString() : value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="w3-card min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Growth & Engagement</h3>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#374151', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar name="New Users" dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar name="Enrollments" dataKey="enrollments" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="w3-card">
          <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {analytics?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">New Enrollment</div>
                    <div className="text-sm text-gray-400">
                      <span className="text-gray-200">{activity.userName}</span> enrolled in <span className="text-blue-300">{activity.courseTitle}</span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm whitespace-nowrap">
                  {new Date(activity.enrolledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {!analytics?.recentActivity?.length && (
               <div className="text-center py-8 text-gray-500">No recent activity</div>
            )}
          </div>
        </div>

        {/* Top Courses */}
        <div className="w3-card">
          <h3 className="text-2xl font-bold text-white mb-6">Top Performing Courses</h3>
          
          {analytics?.popularCourses && analytics.popularCourses.length > 0 ? (
            <div className="space-y-4">
              {analytics.popularCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-700' : 'bg-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{course.title}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {course.enrollments} enrollments
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                    Active
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No enrollment data to display yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
