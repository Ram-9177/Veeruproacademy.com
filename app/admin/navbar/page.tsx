'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react'

interface NavbarCourse {
  id: string
  slug: string
  title: string
  icon: string
  order: number
  visible: boolean
}


export const dynamic = 'force-dynamic'
export default function AdminNavbarPage() {
  const [courses, setCourses] = useState<NavbarCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCourse, setNewCourse] = useState<Partial<NavbarCourse>>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    fetchNavbarCourses()
  }, [])

  const fetchNavbarCourses = async () => {
    try {
      const response = await fetch('/api/admin/navbar-courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch navbar courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCourse = async (course: NavbarCourse) => {
    try {
      const response = await fetch('/api/admin/navbar-courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      })
      
      if (response.ok) {
        fetchNavbarCourses()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to save course:', error)
    }
  }

  const addNewCourse = async () => {
    if (!newCourse.slug || !newCourse.title) return
    
    try {
      const response = await fetch('/api/admin/navbar-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCourse,
          order: courses.length,
          visible: true
        })
      })
      
      if (response.ok) {
        fetchNavbarCourses()
        setNewCourse({})
        setIsAddingNew(false)
      }
    } catch (error) {
      console.error('Failed to add course:', error)
    }
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to remove this course from the navbar?')) return
    
    try {
      const response = await fetch(`/api/admin/navbar-courses/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchNavbarCourses()
      }
    } catch (error) {
      console.error('Failed to delete course:', error)
    }
  }

  const toggleVisibility = async (course: NavbarCourse) => {
    await saveCourse({ ...course, visible: !course.visible })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Navbar Courses</h1>
          <p className="text-gray-400">Manage courses displayed in the navigation bar</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Add New Course Form */}
      {isAddingNew && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Course Slug</label>
              <input
                type="text"
                value={newCourse.slug || ''}
                onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g., react-fundamentals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
              <input
                type="text"
                value={newCourse.title || ''}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g., React Fundamentals"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Emoji)</label>
              <input
                type="text"
                value={newCourse.icon || ''}
                onChange={(e) => setNewCourse({ ...newCourse, icon: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g., ⚛️"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addNewCourse}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Add Course
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false)
                setNewCourse({})
              }}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${
              !course.visible ? 'opacity-60' : ''
            }`}
          >
            {editingId === course.id ? (
              <EditCourseForm
                course={course}
                onSave={saveCourse}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="cursor-move text-gray-400">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="text-2xl">{course.icon}</div>
                  <div>
                    <h3 className="text-white font-medium">{course.title}</h3>
                    <p className="text-gray-400 text-sm">/{course.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(course)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      course.visible
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {course.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => setEditingId(course.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No courses in navbar yet</div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Add your first course
          </button>
        </div>
      )}
    </div>
  )
}

function EditCourseForm({ 
  course: _course, 
  onSave, 
  onCancel
}: { 
  course: NavbarCourse
  onSave: (_course: NavbarCourse) => void
  onCancel: () => void
}) {
  const [editedCourse, setEditedCourse] = useState(_course)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course Slug</label>
          <input
            type="text"
            value={editedCourse.slug}
            onChange={(e) => setEditedCourse({ ...editedCourse, slug: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
          <input
            type="text"
            value={editedCourse.title}
            onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Emoji)</label>
          <input
            type="text"
            value={editedCourse.icon}
            onChange={(e) => setEditedCourse({ ...editedCourse, icon: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(editedCourse)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  )
}