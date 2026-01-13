'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, BookOpen, Video, Code, Target, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface SubtopicContent {
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

interface SubtopicExercise {
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

interface Subtopic {
  id?: string
  title: string
  description: string
  order: number
  estimatedMinutes: number
  content?: SubtopicContent
  exercises: SubtopicExercise[]
}

interface Topic {
  id?: string
  title: string
  description: string
  order: number
  estimatedMinutes: number
  subtopics: Subtopic[]
}

interface Lesson {
  id: string
  title: string
  description: string
  slug: string
  topics: Topic[]
}

export default function SubtopicContentEditor() {
  const params = useParams()
  const lessonId = params?.id as string
  const topicIndex = parseInt(params?.topicIndex as string)
  const subtopicIndex = parseInt(params?.subtopicIndex as string)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'exercises' | 'preview'>('content')
  const [showPreview, setShowPreview] = useState(false)

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/topics`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  const saveSubtopic = async () => {
    if (!lesson) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/topics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: lesson.topics })
      })

      if (response.ok) {
        alert('Sub-topic content saved successfully!')
      } else {
        alert('Error saving sub-topic content')
      }
    } catch (error) {
      console.error('Error saving sub-topic:', error)
      alert('Error saving sub-topic content')
    } finally {
      setSaving(false)
    }
  }

  const updateSubtopicContent = (content: Partial<SubtopicContent>) => {
    if (!lesson || !lesson.topics[topicIndex] || !lesson.topics[topicIndex].subtopics[subtopicIndex]) return

    const updatedLesson = { ...lesson }
    const subtopic = updatedLesson.topics[topicIndex].subtopics[subtopicIndex]
    
    subtopic.content = {
      ...subtopic.content,
      ...content
    } as SubtopicContent

    setLesson(updatedLesson)
  }

  const addExercise = () => {
    if (!lesson || !lesson.topics[topicIndex] || !lesson.topics[topicIndex].subtopics[subtopicIndex]) return

    const newExercise: SubtopicExercise = {
      title: 'New Exercise',
      description: 'Exercise description',
      starterCode: { html: '', css: '', js: '' },
      solution: { html: '', css: '', js: '' },
      hints: []
    }

    const updatedLesson = { ...lesson }
    updatedLesson.topics[topicIndex].subtopics[subtopicIndex].exercises.push(newExercise)
    setLesson(updatedLesson)
  }

  const updateExercise = (exerciseIndex: number, exercise: SubtopicExercise) => {
    if (!lesson || !lesson.topics[topicIndex] || !lesson.topics[topicIndex].subtopics[subtopicIndex]) return

    const updatedLesson = { ...lesson }
    updatedLesson.topics[topicIndex].subtopics[subtopicIndex].exercises[exerciseIndex] = exercise
    setLesson(updatedLesson)
  }

  const removeExercise = (exerciseIndex: number) => {
    if (!lesson || !lesson.topics[topicIndex] || !lesson.topics[topicIndex].subtopics[subtopicIndex]) return

    const updatedLesson = { ...lesson }
    updatedLesson.topics[topicIndex].subtopics[subtopicIndex].exercises = 
      updatedLesson.topics[topicIndex].subtopics[subtopicIndex].exercises.filter((_, i) => i !== exerciseIndex)
    setLesson(updatedLesson)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpen className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'exercise': return <Code className="w-5 h-5" />
      case 'project': return <Target className="w-5 h-5" />
      default: return <BookOpen className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading sub-topic editor...</div>
      </div>
    )
  }

  if (!lesson || !lesson.topics[topicIndex] || !lesson.topics[topicIndex].subtopics[subtopicIndex]) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Sub-topic not found</div>
      </div>
    )
  }

  const topic = lesson.topics[topicIndex]
  const subtopic = topic.subtopics[subtopicIndex]
  const content = subtopic.content || { type: 'reading' as const }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/admin/lessons/${lessonId}/topics`}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Topics
            </Link>
            <div>
              <h1 className="text-xl font-bold">Edit Sub-topic Content</h1>
              <p className="text-gray-400 text-sm">
                {topic.title} → {subtopic.title}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={saveSubtopic}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Content'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          {/* Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 px-6">
            <div className="flex space-x-6">
              {['content', 'exercises', 'preview'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-2 border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="p-6 space-y-6">
              {/* Content Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content Type
                </label>
                <select
                  value={content.type}
                  onChange={(e) => updateSubtopicContent({ type: e.target.value as any })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="reading">📖 Reading Material</option>
                  <option value="video">📹 Video Content</option>
                  <option value="exercise">🛠️ Hands-on Exercise</option>
                  <option value="project">🎯 Project Work</option>
                </select>
              </div>

              {/* Theory Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theory Content (Markdown)
                </label>
                <div className="bg-gray-800 rounded-lg border border-gray-600">
                  <ReactQuill
                    value={content.theory || ''}
                    onChange={(value) => updateSubtopicContent({ theory: value })}
                    theme="snow"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white',
                      minHeight: '300px'
                    }}
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

              {/* Video Content */}
              {content.type === 'video' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      YouTube Video ID
                    </label>
                    <input
                      type="text"
                      value={content.youtubeId || ''}
                      onChange={(e) => updateSubtopicContent({ youtubeId: e.target.value })}
                      placeholder="e.g., dQw4w9WgXcQ"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={content.duration || ''}
                      onChange={(e) => updateSubtopicContent({ duration: e.target.value })}
                      placeholder="e.g., 10:30"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* Code Example */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code Example
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">HTML</label>
                    <textarea
                      value={content.codeExample?.html || ''}
                      onChange={(e) => updateSubtopicContent({
                        codeExample: { ...content.codeExample, html: e.target.value }
                      })}
                      className="w-full h-32 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                      placeholder="HTML code..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">CSS</label>
                    <textarea
                      value={content.codeExample?.css || ''}
                      onChange={(e) => updateSubtopicContent({
                        codeExample: { ...content.codeExample, css: e.target.value }
                      })}
                      className="w-full h-32 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                      placeholder="CSS code..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">JavaScript</label>
                    <textarea
                      value={content.codeExample?.js || ''}
                      onChange={(e) => updateSubtopicContent({
                        codeExample: { ...content.codeExample, js: e.target.value }
                      })}
                      className="w-full h-32 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                      placeholder="JavaScript code..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === 'exercises' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Interactive Exercises</h3>
                <button
                  onClick={addExercise}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </button>
              </div>

              <div className="space-y-6">
                {subtopic.exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Exercise {index + 1}</h4>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Exercise Title
                        </label>
                        <input
                          type="text"
                          value={exercise.title}
                          onChange={(e) => updateExercise(index, { ...exercise, title: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={exercise.description}
                          onChange={(e) => updateExercise(index, { ...exercise, description: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Starter Code */}
                      <div>
                        <h5 className="font-medium mb-3 text-green-400">Starter Code</h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">HTML</label>
                            <textarea
                              value={exercise.starterCode.html || ''}
                              onChange={(e) => updateExercise(index, {
                                ...exercise,
                                starterCode: { ...exercise.starterCode, html: e.target.value }
                              })}
                              className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">CSS</label>
                            <textarea
                              value={exercise.starterCode.css || ''}
                              onChange={(e) => updateExercise(index, {
                                ...exercise,
                                starterCode: { ...exercise.starterCode, css: e.target.value }
                              })}
                              className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">JavaScript</label>
                            <textarea
                              value={exercise.starterCode.js || ''}
                              onChange={(e) => updateExercise(index, {
                                ...exercise,
                                starterCode: { ...exercise.starterCode, js: e.target.value }
                              })}
                              className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Solution Code */}
                      <div>
                        <h5 className="font-medium mb-3 text-blue-400">Solution Code</h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">HTML</label>
                            <textarea
                              value={exercise.solution.html || ''}
                              onChange={(e) => updateExercise(index, {
                                ...exercise,
                                solution: { ...exercise.solution, html: e.target.value }
                              })}
                              className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">CSS</label>
                            <textarea
                              value={exercise.solution.css || ''}
                              onChange={(e) => updateExercise(index, {
                                ...exercise,
                                solution: { ...exercise.solution, css: e.target.value }
                              })}
                              className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">JavaScript</label>
                            <textarea
                              value={exercise.solution.js || ''}
                              onChange={(e) => updateExercise(index, {
                                ...exercise,
                                solution: { ...exercise.solution, js: e.target.value }
                              })}
                              className="w-full h-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {subtopic.exercises.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No exercises yet</h3>
                    <p className="mb-4">Add interactive coding exercises for this sub-topic</p>
                    <button
                      onClick={addExercise}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2 inline" />
                      Add First Exercise
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="p-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  {getContentTypeIcon(content.type)}
                  <div>
                    <h3 className="text-xl font-bold">{subtopic.title}</h3>
                    <p className="text-gray-400">{subtopic.description}</p>
                  </div>
                </div>

                {content.theory && (
                  <div className="prose prose-invert max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: content.theory }} />
                  </div>
                )}

                {content.youtubeId && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">YouTube Video: {content.youtubeId}</p>
                    </div>
                  </div>
                )}

                {content.codeExample && (content.codeExample.html || content.codeExample.css || content.codeExample.js) && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Code Example</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {content.codeExample.html && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">HTML</label>
                          <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                            <code>{content.codeExample.html}</code>
                          </pre>
                        </div>
                      )}
                      {content.codeExample.css && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">CSS</label>
                          <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                            <code>{content.codeExample.css}</code>
                          </pre>
                        </div>
                      )}
                      {content.codeExample.js && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">JavaScript</label>
                          <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
                            <code>{content.codeExample.js}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {subtopic.exercises.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Exercises ({subtopic.exercises.length})</h4>
                    <div className="space-y-3">
                      {subtopic.exercises.map((exercise, index) => (
                        <div key={index} className="bg-gray-700 rounded p-3">
                          <h5 className="font-medium">{exercise.title}</h5>
                          <p className="text-sm text-gray-300">{exercise.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Sidebar */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-700 bg-gray-800">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Live Preview</h3>
            </div>
            <div className="p-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  {getContentTypeIcon(content.type)}
                  <h4 className="font-semibold">{subtopic.title}</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">{subtopic.description}</p>
                
                {content.theory && (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: content.theory }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
