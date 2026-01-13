'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Eye, Code, FileText, Video, Target, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamic import for rich text editor to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface LessonContent {
  id?: string
  type: 'reading' | 'video' | 'exercise' | 'project'
  theory?: string
  videoUrl?: string
  youtubeId?: string
  duration?: string
  codeExample?: {
    html?: string
    css?: string
    js?: string
  }
}

interface Exercise {
  id?: string
  title: string
  description: string
  starterCode: {
    html?: string
    css?: string
    js?: string
  }
  solution: {
    html?: string
    css?: string
    js?: string
  }
  hints: string[]
}

interface Lesson {
  id: string
  title: string
  description: string | null
  slug: string
  courseId: string | null
  moduleId: string | null
  order: number
  estimatedMinutes: number | null
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  content?: LessonContent | null
  exercises?: Exercise[]
}

interface LessonEditorProps {
  lesson: Lesson
  courses: { id: string, title: string, slug: string }[]
}

export function LessonEditor({ lesson: initialLesson, courses }: LessonEditorProps) {
  const router = useRouter()
  // Ensure exercises handles undefined
  const [lesson, setLesson] = useState<Lesson>({
    ...initialLesson,
    exercises: initialLesson.exercises || [],
    content: initialLesson.content || { type: 'reading' }
  })
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'exercises' | 'settings'>('content')

  const isNew = !lesson.id
  const courseSlug = lesson.courseId
    ? courses.find((c) => c.id === lesson.courseId)?.slug
    : null
  const previewHref = courseSlug
    ? `/courses/${courseSlug}/learn?lesson=${lesson.slug}`
    : `/lessons/${lesson.slug}`

  const saveLesson = async () => {
    setSaving(true)
    try {
      const url = isNew ? '/api/admin/lessons' : `/api/admin/lessons/${lesson.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson)
      })

      if (response.ok) {
        alert('Lesson saved successfully!')
        if (isNew) {
            const data = await response.json()
            // Redirect to edit page of the new lesson or list
            if (data.id || data.lesson?.id) {
                 router.push(`/admin/lessons/${data.id || data.lesson.id}/edit`)
            } else {
                 router.push('/admin/lessons')
            }
        }
      } else {
        alert('Error saving lesson')
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Error saving lesson')
    } finally {
      setSaving(false)
    }
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      title: 'New Exercise',
      description: 'Exercise description',
      starterCode: { html: '', css: '', js: '' },
      solution: { html: '', css: '', js: '' },
      hints: []
    }

    setLesson({
      ...lesson,
      exercises: [...(lesson.exercises || []), newExercise]
    })
  }

  const updateExercise = (index: number, exercise: Exercise) => {
    const updatedExercises = [...(lesson.exercises || [])]
    updatedExercises[index] = exercise
    setLesson({ ...lesson, exercises: updatedExercises })
  }

  const removeExercise = (index: number) => {
    setLesson({
      ...lesson,
      exercises: (lesson.exercises || []).filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/lessons"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Lessons
            </Link>
            <div>
              <h1 className="text-xl font-bold">{isNew ? 'Create New Lesson' : 'Edit Lesson'}</h1>
              <p className="text-gray-400 text-sm">{lesson.title || 'Untitled Lesson'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isNew && (
              <button
                onClick={() => router.push(previewHref)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            )}
            <button
              onClick={saveLesson}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
              { id: 'exercises', label: 'Exercises', icon: <Code className="w-4 h-4" /> },
              { id: 'settings', label: 'Settings', icon: <Target className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* Course Selection for New Lesson */}
              {isNew && (
                  <div className="bg-gray-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Course</h3>
                      <label className="block text-sm font-medium mb-2">Select Course</label>
                      <select
                          value={lesson.courseId || ''}
                          onChange={(e) => setLesson({ ...lesson, courseId: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="">Select a course...</option>
                          {courses.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                      </select>
                  </div>
              )}

              {/* Lesson Type */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Lesson Type</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { type: 'reading', label: 'Reading', icon: <FileText className="w-6 h-6" /> },
                    { type: 'video', label: 'Video', icon: <Video className="w-6 h-6" /> },
                    { type: 'exercise', label: 'Exercise', icon: <Code className="w-6 h-6" /> },
                    { type: 'project', label: 'Project', icon: <Target className="w-6 h-6" /> }
                  ].map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setLesson({
                        ...lesson,
                        content: { ...lesson.content!, type: option.type as any }
                      })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        lesson.content?.type === option.type
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {option.icon}
                        <span className="text-sm">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theory Content */}
              {(lesson.content?.type === 'reading' || lesson.content?.type === 'exercise' || lesson.content?.type === 'project') && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Theory Content</h3>
                  <div className="bg-white rounded-lg text-black">
                    <ReactQuill
                      value={lesson.content?.theory || ''}
                      onChange={(value) => setLesson({
                        ...lesson,
                        content: { ...lesson.content!, theory: value } as any
                      })}
                      theme="snow"
                      style={{ height: '400px', paddingBottom: '42px' }}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['blockquote', 'code-block'],
                          ['link', 'image'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Video Content */}
              {lesson.content?.type === 'video' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Video Content</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">YouTube Video ID</label>
                      <input
                        type="text"
                        value={lesson.content?.youtubeId || ''}
                        onChange={(e) => setLesson({
                          ...lesson,
                          content: { ...lesson.content!, youtubeId: e.target.value } as any
                        })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="dQw4w9WgXcQ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration</label>
                      <input
                        type="text"
                        value={lesson.content?.duration || ''}
                        onChange={(e) => setLesson({
                          ...lesson,
                          content: { ...lesson.content!, duration: e.target.value } as any
                        })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="15 min"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Code Example */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Code Example</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">HTML</label>
                    <textarea
                      value={lesson.content?.codeExample?.html || ''}
                      onChange={(e) => setLesson({
                        ...lesson,
                        content: {
                          ...lesson.content!,
                          codeExample: {
                            ...lesson.content?.codeExample,
                            html: e.target.value
                          }
                        } as any
                      })}
                      className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="<h1>Hello World</h1>"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CSS</label>
                    <textarea
                      value={lesson.content?.codeExample?.css || ''}
                      onChange={(e) => setLesson({
                        ...lesson,
                        content: {
                          ...lesson.content!,
                          codeExample: {
                            ...lesson.content?.codeExample,
                            css: e.target.value
                          }
                        } as any
                      })}
                      className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="h1 { color: blue; }"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">JavaScript</label>
                    <textarea
                      value={lesson.content?.codeExample?.js || ''}
                      onChange={(e) => setLesson({
                        ...lesson,
                        content: {
                          ...lesson.content!,
                          codeExample: {
                            ...lesson.content?.codeExample,
                            js: e.target.value
                          }
                        } as any
                      })}
                      className="w-full h-40 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder="console.log('Hello');"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Exercises</h3>
                <button
                  onClick={addExercise}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </button>
              </div>

              {lesson.exercises?.map((exercise, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Exercise {index + 1}</h4>
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={exercise.title}
                        onChange={(e) => updateExercise(index, { ...exercise, title: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={exercise.description}
                        onChange={(e) => updateExercise(index, { ...exercise, description: e.target.value })}
                        className="w-full h-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Starter Code (HTML)</label>
                        <textarea
                          value={exercise.starterCode.html || ''}
                          onChange={(e) => updateExercise(index, {
                            ...exercise,
                            starterCode: { ...exercise.starterCode, html: e.target.value }
                          })}
                          className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Solution (HTML)</label>
                        <textarea
                          value={exercise.solution.html || ''}
                          onChange={(e) => updateExercise(index, {
                            ...exercise,
                            solution: { ...exercise.solution, html: e.target.value }
                          })}
                          className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(!lesson.exercises || lesson.exercises.length === 0) && (
                <div className="text-center py-12 text-gray-400">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No exercises yet. Add your first exercise to get started!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Lesson Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <input
                      type="text"
                      value={lesson.slug}
                      onChange={(e) => setLesson({ ...lesson, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated Minutes</label>
                    <input
                      type="number"
                      value={lesson.estimatedMinutes || ''}
                      onChange={(e) => setLesson({ ...lesson, estimatedMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={lesson.difficulty || 'Beginner'}
                      onChange={(e) => setLesson({ ...lesson, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={lesson.status}
                      onChange={(e) => setLesson({ ...lesson, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <input
                      type="number"
                      value={lesson.order}
                      onChange={(e) => setLesson({ ...lesson, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={lesson.description || ''}
                    onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                    className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
