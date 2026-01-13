'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'

interface Module {
  id: string
  title: string
  slug: string
  description: string
  order: number
  course: {
    id: string
    title: string
    slug: string
  }
  _count: {
    lessons: number
  }
}

export default function AdminModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/admin/modules')
      if (response.ok) {
        const data = await response.json()
        setModules(data.modules || [])
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading modules...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Course Modules</h1>
            <p className="text-gray-400 mt-2">Manage course modules and lessons</p>
          </div>
          <Link
            href="/admin/modules/new"
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Module
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <div key={module.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.course.title}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/modules/${module.id}/edit`}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {module.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  {module._count.lessons} lessons
                </div>
                <span className="text-gray-500">Order: {module.order}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No modules found</h3>
            <p className="text-gray-500">Create your first module to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}