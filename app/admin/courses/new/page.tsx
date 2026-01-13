'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Youtube, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface CourseModule {
  name: string
  description: string
  lessons: CourseLesson[]
}

interface CourseLesson {
  title: string
  description: string
  youtubeUrl: string
  duration: string
  order: number
}


export const dynamic = 'force-dynamic'
export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({
    title: '',
    slug: '',
    description: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    language: '',
    price: 0,
    originalPrice: 0,
    duration: '',
    thumbnail: '',
    youtubePlaylistUrl: '',
    tags: [] as string[],
    tools: [] as string[],
    whatYouWillLearn: [] as string[],
    modules: [] as CourseModule[],
    instructor: {
      name: 'Veeru Pro',
      role: 'Expert Instructor',
      bio: 'Experienced developer and educator'
    }
  })

  const [newTag, setNewTag] = useState('')
  const [newTool, setNewTool] = useState('')
  const [newLearningPoint, setNewLearningPoint] = useState('')

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setCourse(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !course.tags.includes(newTag.trim())) {
      setCourse(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCourse(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addTool = () => {
    if (newTool.trim() && !course.tools.includes(newTool.trim())) {
      setCourse(prev => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()]
      }))
      setNewTool('')
    }
  }

  const removeTool = (toolToRemove: string) => {
    setCourse(prev => ({
      ...prev,
      tools: prev.tools.filter(tool => tool !== toolToRemove)
    }))
  }

  const addLearningPoint = () => {
    if (newLearningPoint.trim()) {
      setCourse(prev => ({
        ...prev,
        whatYouWillLearn: [...prev.whatYouWillLearn, newLearningPoint.trim()]
      }))
      setNewLearningPoint('')
    }
  }

  const removeLearningPoint = (index: number) => {
    setCourse(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
    }))
  }

  const addModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, {
        name: '',
        description: '',
        lessons: []
      }]
    }))
  }

  const updateModule = (index: number, field: keyof CourseModule, value: any) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === index ? { ...module, [field]: value } : module
      )
    }))
  }

  const removeModule = (index: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }))
  }

  const addLesson = (moduleIndex: number) => {
    const newLesson: CourseLesson = {
      title: '',
      description: '',
      youtubeUrl: '',
      duration: '',
      order: course.modules[moduleIndex].lessons.length + 1
    }

    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    }))
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof CourseLesson, value: any) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              lessons: module.lessons.map((lesson, j) => 
                j === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : module
      )
    }))
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              lessons: module.lessons.filter((_, j) => j !== lessonIndex)
            }
          : module
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...course,
          lessons: course.modules.reduce((total, module) => total + module.lessons.length, 0),
          projects: course.modules.length
        }),
      })

      if (response.ok) {
        router.push('/admin/courses')
      } else {
        throw new Error('Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="w3-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/courses"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Create New Course</h1>
              <p className="text-gray-400">Add a new course with YouTube video integration</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="w3-card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Course Title *</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="form-control"
                    placeholder="e.g., Complete JavaScript Course"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    value={course.slug}
                    onChange={(e) => setCourse(prev => ({ ...prev, slug: e.target.value }))}
                    className="form-control"
                    placeholder="complete-javascript-course"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description *</label>
                <textarea
                  value={course.description}
                  onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                  className="form-control"
                  rows={3}
                  placeholder="Brief description of what students will learn..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Level *</label>
                  <select
                    value={course.level}
                    onChange={(e) => setCourse(prev => ({ ...prev, level: e.target.value as any }))}
                    className="form-control"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Language/Technology</label>
                  <input
                    type="text"
                    value={course.language}
                    onChange={(e) => setCourse(prev => ({ ...prev, language: e.target.value }))}
                    className="form-control"
                    placeholder="e.g., JavaScript, Python, React"
                  />
                </div>
                <div>
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    value={course.duration}
                    onChange={(e) => setCourse(prev => ({ ...prev, duration: e.target.value }))}
                    className="form-control"
                    placeholder="e.g., 4 weeks, 20 hours"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    value={course.price}
                    onChange={(e) => setCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="form-control"
                    placeholder="0 for free course"
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    value={course.originalPrice}
                    onChange={(e) => setCourse(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    className="form-control"
                    placeholder="For showing discounts"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Integration */}
          <div className="w3-card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                YouTube Integration
              </h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label">YouTube Playlist URL</label>
                <input
                  type="url"
                  value={course.youtubePlaylistUrl}
                  onChange={(e) => setCourse(prev => ({ ...prev, youtubePlaylistUrl: e.target.value }))}
                  className="form-control"
                  placeholder="https://youtube.com/playlist?list=..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  Link to your YouTube playlist for this course to drive traffic
                </p>
              </div>

              <div>
                <label className="form-label">Thumbnail URL</label>
                <input
                  type="url"
                  value={course.thumbnail}
                  onChange={(e) => setCourse(prev => ({ ...prev, thumbnail: e.target.value }))}
                  className="form-control"
                  placeholder="https://example.com/course-thumbnail.jpg"
                />
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="w3-card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-white">Course Content</h2>
            </div>
            <div className="card-body space-y-6">
              {/* What You'll Learn */}
              <div>
                <label className="form-label">What You&apos;ll Learn</label>
                <div className="space-y-2">
                  {course.whatYouWillLearn.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 px-3 py-2 bg-gray-700 rounded text-gray-200">{point}</span>
                      <button
                        type="button"
                        onClick={() => removeLearningPoint(index)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLearningPoint}
                      onChange={(e) => setNewLearningPoint(e.target.value)}
                      className="form-control"
                      placeholder="Add learning outcome..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningPoint())}
                    />
                    <button
                      type="button"
                      onClick={addLearningPoint}
                      className="btn btn-outline"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="form-label">Tags</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-400 hover:text-blue-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="form-control"
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn btn-outline"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tools */}
              <div>
                <label className="form-label">Tools & Technologies</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {course.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-900 text-green-300 rounded text-sm"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => removeTool(tool)}
                          className="text-green-400 hover:text-green-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                      className="form-control"
                      placeholder="Add tool..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                    />
                    <button
                      type="button"
                      onClick={addTool}
                      className="btn btn-outline"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Modules */}
          <div className="w3-card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Course Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Module
              </button>
            </div>
            <div className="card-body space-y-6">
              {course.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Module {moduleIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Module Name</label>
                      <input
                        type="text"
                        value={module.name}
                        onChange={(e) => updateModule(moduleIndex, 'name', e.target.value)}
                        className="form-control"
                        placeholder="e.g., JavaScript Fundamentals"
                      />
                    </div>

                    <div>
                      <label className="form-label">Module Description</label>
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                        className="form-control"
                        rows={2}
                        placeholder="Brief description of this module..."
                      />
                    </div>

                    {/* Lessons */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="form-label mb-0">Lessons</label>
                        <button
                          type="button"
                          onClick={() => addLesson(moduleIndex)}
                          className="btn btn-outline btn-sm flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Lesson
                        </button>
                      </div>

                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="bg-gray-700 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-300">
                                Lesson {lessonIndex + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                  className="form-control"
                                  placeholder="Lesson title..."
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                  className="form-control"
                                  placeholder="Duration (e.g., 15 min)"
                                />
                              </div>
                            </div>

                            <div className="mt-2">
                              <textarea
                                value={lesson.description}
                                onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'description', e.target.value)}
                                className="form-control"
                                rows={2}
                                placeholder="Lesson description..."
                              />
                            </div>

                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <Youtube className="w-4 h-4 text-red-500" />
                                <input
                                  type="url"
                                  value={lesson.youtubeUrl}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'youtubeUrl', e.target.value)}
                                  className="form-control"
                                  placeholder="YouTube video URL..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {course.modules.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p>No modules added yet. Click &quot;Add Module&quot; to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}