'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Edit, ChevronDown, ChevronRight, BookOpen, Video, Code, Target, Clock } from 'lucide-react'
import Link from 'next/link'

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

export default function LessonTopicsPage() {
  const params = useParams()
  const lessonId = params?.id as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set())
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set())

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

  const saveLesson = async () => {
    if (!lesson) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/lessons/${lessonId}/topics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: lesson.topics })
      })

      if (response.ok) {
        alert('Lesson topics saved successfully!')
      } else {
        alert('Error saving lesson topics')
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Error saving lesson topics')
    } finally {
      setSaving(false)
    }
  }

  const addTopic = () => {
    if (!lesson) return

    const newTopic: Topic = {
      title: 'New Topic',
      description: 'Topic description',
      order: lesson.topics.length,
      estimatedMinutes: 15,
      subtopics: []
    }

    setLesson({
      ...lesson,
      topics: [...lesson.topics, newTopic]
    })
  }

  const updateTopic = (index: number, topic: Topic) => {
    if (!lesson) return

    const updatedTopics = [...lesson.topics]
    updatedTopics[index] = topic
    setLesson({ ...lesson, topics: updatedTopics })
  }

  const removeTopic = (index: number) => {
    if (!lesson) return

    setLesson({
      ...lesson,
      topics: lesson.topics.filter((_, i) => i !== index)
    })
  }

  const addSubtopic = (topicIndex: number) => {
    if (!lesson) return

    const newSubtopic: Subtopic = {
      title: 'New Sub-topic',
      description: 'Sub-topic description',
      order: lesson.topics[topicIndex].subtopics.length,
      estimatedMinutes: 5,
      exercises: []
    }

    const updatedTopics = [...lesson.topics]
    updatedTopics[topicIndex].subtopics.push(newSubtopic)
    setLesson({ ...lesson, topics: updatedTopics })
  }

  const updateSubtopic = (topicIndex: number, subtopicIndex: number, subtopic: Subtopic) => {
    if (!lesson) return

    const updatedTopics = [...lesson.topics]
    updatedTopics[topicIndex].subtopics[subtopicIndex] = subtopic
    setLesson({ ...lesson, topics: updatedTopics })
  }

  const removeSubtopic = (topicIndex: number, subtopicIndex: number) => {
    if (!lesson) return

    const updatedTopics = [...lesson.topics]
    updatedTopics[topicIndex].subtopics = updatedTopics[topicIndex].subtopics.filter((_, i) => i !== subtopicIndex)
    setLesson({ ...lesson, topics: updatedTopics })
  }

  const toggleTopic = (index: number) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedTopics(newExpanded)
  }

  const toggleSubtopic = (key: string) => {
    const newExpanded = new Set(expandedSubtopics)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedSubtopics(newExpanded)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpen className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'exercise': return <Code className="w-4 h-4" />
      case 'project': return <Target className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading lesson topics...</div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/admin/lessons/${lessonId}/edit`}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Lesson
            </Link>
            <div>
              <h1 className="text-xl font-bold">Lesson Topics & Sub-topics</h1>
              <p className="text-gray-400 text-sm">{lesson.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={addTopic}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Topic
            </button>
            <button
              onClick={saveLesson}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Topics'}
            </button>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {lesson.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="bg-gray-800 rounded-lg border border-gray-700">
              {/* Topic Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTopic(topicIndex)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {expandedTopics.has(topicIndex) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => updateTopic(topicIndex, { ...topic, title: e.target.value })}
                        className="text-lg font-semibold bg-transparent border-none outline-none text-white w-full"
                        placeholder="Topic title"
                      />
                      <input
                        type="text"
                        value={topic.description}
                        onChange={(e) => updateTopic(topicIndex, { ...topic, description: e.target.value })}
                        className="text-sm text-gray-400 bg-transparent border-none outline-none w-full mt-1"
                        placeholder="Topic description"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      <input
                        type="number"
                        value={topic.estimatedMinutes}
                        onChange={(e) => updateTopic(topicIndex, { ...topic, estimatedMinutes: parseInt(e.target.value) })}
                        className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                      />
                      <span className="ml-1">min</span>
                    </div>
                    <button
                      onClick={() => addSubtopic(topicIndex)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1 inline" />
                      Sub-topic
                    </button>
                    <button
                      onClick={() => removeTopic(topicIndex)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtopics */}
              {expandedTopics.has(topicIndex) && (
                <div className="p-4 space-y-3">
                  {topic.subtopics.map((subtopic, subtopicIndex) => {
                    const subtopicKey = `${topicIndex}-${subtopicIndex}`
                    return (
                      <div key={subtopicIndex} className="bg-gray-700 rounded-lg border border-gray-600">
                        {/* Subtopic Header */}
                        <div className="p-3 border-b border-gray-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => toggleSubtopic(subtopicKey)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                {expandedSubtopics.has(subtopicKey) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={subtopic.title}
                                  onChange={(e) => updateSubtopic(topicIndex, subtopicIndex, { ...subtopic, title: e.target.value })}
                                  className="font-medium bg-transparent border-none outline-none text-white w-full"
                                  placeholder="Sub-topic title"
                                />
                                <input
                                  type="text"
                                  value={subtopic.description}
                                  onChange={(e) => updateSubtopic(topicIndex, subtopicIndex, { ...subtopic, description: e.target.value })}
                                  className="text-sm text-gray-300 bg-transparent border-none outline-none w-full mt-1"
                                  placeholder="Sub-topic description"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <input
                                  type="number"
                                  value={subtopic.estimatedMinutes}
                                  onChange={(e) => updateSubtopic(topicIndex, subtopicIndex, { ...subtopic, estimatedMinutes: parseInt(e.target.value) })}
                                  className="w-12 bg-gray-600 border border-gray-500 rounded px-1 py-1 text-white text-xs"
                                />
                                <span className="ml-1 text-xs">min</span>
                              </div>
                              <Link
                                href={`/admin/lessons/${lessonId}/topics/${topicIndex}/subtopics/${subtopicIndex}/edit`}
                                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
                              >
                                <Edit className="w-3 h-3 mr-1 inline" />
                                Edit Content
                              </Link>
                              <button
                                onClick={() => removeSubtopic(topicIndex, subtopicIndex)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Subtopic Details */}
                        {expandedSubtopics.has(subtopicKey) && (
                          <div className="p-3">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <label className="block text-gray-400 mb-1">Content Type</label>
                                <select
                                  value={subtopic.content?.type || 'reading'}
                                  onChange={(e) => updateSubtopic(topicIndex, subtopicIndex, {
                                    ...subtopic,
                                    content: { ...subtopic.content, type: e.target.value as any }
                                  })}
                                  className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 text-white"
                                >
                                  <option value="reading">📖 Reading</option>
                                  <option value="video">📹 Video</option>
                                  <option value="exercise">🛠️ Exercise</option>
                                  <option value="project">🎯 Project</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-400 mb-1">Exercises</label>
                                <div className="text-gray-300">
                                  {subtopic.exercises.length} exercise(s)
                                </div>
                              </div>
                              <div>
                                <label className="block text-gray-400 mb-1">Status</label>
                                <div className="flex items-center text-gray-300">
                                  {getContentTypeIcon(subtopic.content?.type || 'reading')}
                                  <span className="ml-2">
                                    {subtopic.content?.theory ? 'Has content' : 'No content'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {topic.subtopics.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No sub-topics yet. Add your first sub-topic to get started!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {lesson.topics.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No topics yet</h3>
              <p className="mb-4">Create your first topic to organize lesson content</p>
              <button
                onClick={addTopic}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 mr-2 inline" />
                Add First Topic
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
