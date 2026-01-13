'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, CheckCircle, Code, BookOpen, FileText, Lightbulb, Target, Video } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { EnhancedCodeExample } from '@/app/components/EnhancedCodeExample'
import { YouTubeEmbed } from '@/app/components/YouTubeEmbed'
import { CodeBlock } from '@/app/components/CodeBlock'
import { LessonQuiz } from './components/LessonQuiz'

// Helper function to get lesson icon
const getLessonIcon = (type: 'video' | 'exercise' | 'project' | 'reading') => {
  switch (type) {
    case 'reading':
      return <FileText className="w-5 h-5 text-blue-400" />
    case 'video':
      return <Play className="w-5 h-5 text-gray-400" />
    case 'exercise':
      return <Code className="w-5 h-5 text-orange-400" />
    case 'project':
      return <Target className="w-5 h-5 text-purple-400" />
    default:
      return <FileText className="w-5 h-5 text-blue-400" />
  }
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  level: string
  duration: string
  status: string
  metadata?: any
}

interface LessonContent {
  id: string
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
  id: string
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
  order: number
}

interface Topic {
  id: string
  title: string
  description: string
  order: number
  estimatedMinutes: number
  subtopics: Subtopic[]
}

interface Subtopic {
  id: string
  title: string
  description: string
  order: number
  estimatedMinutes: number
  content?: SubtopicContent
  exercises: SubtopicExercise[]
}

interface SubtopicContent {
  id: string
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
  id: string
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
  order: number
}

interface Lesson {
  id: string
  title: string
  description: string
  slug: string
  order: number
  estimatedMinutes: number
  difficulty: string
  status: string
  content?: LessonContent
  exercises: Exercise[]
  topics: Topic[]
  quizQuestions?: QuizQuestion[]
  module?: {
    id: string
    title: string
    slug: string
    order: number
  }
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export default function CourseLearningPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseSlug = (params?.courseSlug as string) || ''
  
  const initialLessonSlug = searchParams?.get('lesson') || ''
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentTopic, setCurrentTopic] = useState(0)
  const [currentSubtopic, setCurrentSubtopic] = useState(0)
  const [completedSubtopics, setCompletedSubtopics] = useState<string[]>([])
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set([0]))
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)

  const fetchCourseData = useCallback(async () => {
    if (!courseSlug) return
    try {
      setLoading(true)
      const response = await fetch(`/api/courses/${courseSlug}/lessons`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
        setLessons(data.lessons)
        setIsNotFound(false)
      } else {
        if (response.status === 401) {
          const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search)
          router.replace(`/login?callbackUrl=${callbackUrl}`)
          return
        }
        const body = await response.json().catch(() => null)
        if (response.status === 403 && body?.redirect) {
          router.replace(body.redirect)
          return
        }
        setIsNotFound(true)
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      setIsNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [courseSlug, router])

  // Load course and lessons from API
  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  // Load progress from localStorage on component mount
  useEffect(() => {
    if (!courseSlug || lessons.length === 0) return

    const savedProgress = localStorage.getItem(`course-progress-${courseSlug}`)
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setCompletedSubtopics(progress.completedSubtopics || [])
        setCurrentLesson(progress.currentLesson || 0)
        setCurrentTopic(progress.currentTopic || 0)
        setCurrentSubtopic(progress.currentSubtopic || 0)
        if (progress.expandedTopics) {
          setExpandedTopics(new Set(progress.expandedTopics))
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }

    if (initialLessonSlug) {
      const initialIndex = lessons.findIndex((lesson) => lesson.slug === initialLessonSlug)
      if (initialIndex >= 0) {
        setCurrentLesson(initialIndex)
        setCurrentTopic(0)
        setCurrentSubtopic(0)
        setExpandedTopics(new Set([0]))
      }
    }
  }, [courseSlug, lessons, initialLessonSlug])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (courseSlug && lessons.length > 0) {
      const progress = {
        completedSubtopics,
        currentLesson,
        currentTopic,
        currentSubtopic,
        expandedTopics: Array.from(expandedTopics),
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(`course-progress-${courseSlug}`, JSON.stringify(progress))
    }
  }, [completedSubtopics, currentLesson, currentTopic, currentSubtopic, expandedTopics, courseSlug, lessons])

  const toggleSubtopicComplete = async (subtopicId: string) => {
    setIsLoading(true)
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (completedSubtopics.includes(subtopicId)) {
      setCompletedSubtopics(completedSubtopics.filter(id => id !== subtopicId))
    } else {
      setCompletedSubtopics([...completedSubtopics, subtopicId])
      
      // Auto-advance to next subtopic if available
      const currentLessonData = lessons[currentLesson]
      if (currentLessonData?.topics && currentLessonData.topics[currentTopic]) {
        const topic = currentLessonData.topics[currentTopic]
        if (currentSubtopic < topic.subtopics.length - 1) {
          setTimeout(() => {
            setCurrentSubtopic(currentSubtopic + 1)
          }, 1000)
        } else if (currentTopic < currentLessonData.topics.length - 1) {
          // Move to next topic
          setTimeout(() => {
            setCurrentTopic(currentTopic + 1)
            setCurrentSubtopic(0)
            setExpandedTopics(prev => new Set([...Array.from(prev), currentTopic + 1]))
          }, 1000)
        } else if (currentLesson < lessons.length - 1) {
          // Move to next lesson
          setTimeout(() => {
            setCurrentLesson(currentLesson + 1)
            setCurrentTopic(0)
            setCurrentSubtopic(0)
            setExpandedTopics(new Set([0]))
          }, 1000)
        }
      }
    }
    
    setIsLoading(false)
  }

  const goToPreviousSubtopic = () => {
    if (currentSubtopic > 0) {
      setCurrentSubtopic(currentSubtopic - 1)
    } else if (currentTopic > 0) {
      const prevTopic = lessons[currentLesson]?.topics[currentTopic - 1]
      if (prevTopic) {
        setCurrentTopic(currentTopic - 1)
        setCurrentSubtopic(prevTopic.subtopics.length - 1)
        setExpandedTopics(prev => new Set([...Array.from(prev), currentTopic - 1]))
      }
    } else if (currentLesson > 0) {
      const prevLesson = lessons[currentLesson - 1]
      if (prevLesson?.topics && prevLesson.topics.length > 0) {
        setCurrentLesson(currentLesson - 1)
        const lastTopic = prevLesson.topics.length - 1
        setCurrentTopic(lastTopic)
        setCurrentSubtopic(prevLesson.topics[lastTopic].subtopics.length - 1)
        setExpandedTopics(new Set([lastTopic]))
      }
    }
  }

  const goToNextSubtopic = () => {
    const currentLessonData = lessons[currentLesson]
    if (!currentLessonData?.topics) return

    const topic = currentLessonData.topics[currentTopic]
    if (currentSubtopic < topic.subtopics.length - 1) {
      setCurrentSubtopic(currentSubtopic + 1)
    } else if (currentTopic < currentLessonData.topics.length - 1) {
      setCurrentTopic(currentTopic + 1)
      setCurrentSubtopic(0)
      setExpandedTopics(prev => new Set([...Array.from(prev), currentTopic + 1]))
    } else if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      setCurrentTopic(0)
      setCurrentSubtopic(0)
      setExpandedTopics(new Set([0]))
    }
  }

  const toggleTopic = (topicIndex: number) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicIndex)) {
      newExpanded.delete(topicIndex)
    } else {
      newExpanded.add(topicIndex)
    }
    setExpandedTopics(newExpanded)
  }

  const navigateToSubtopic = (lessonIndex: number, topicIndex: number, subtopicIndex: number) => {
    setCurrentLesson(lessonIndex)
    setCurrentTopic(topicIndex)
    setCurrentSubtopic(subtopicIndex)
    setExpandedTopics(prev => new Set([...Array.from(prev), topicIndex]))
  }

  const currentLessonData = lessons[currentLesson]
  const currentTopicData = currentLessonData?.topics?.[currentTopic]
  const currentSubtopicData = currentTopicData?.subtopics?.[currentSubtopic]
  const baseSandboxUrl = currentSubtopicData
    ? `/sandbox?subtopic=${currentSubtopicData.id}&lesson=${currentLessonData?.id}&course=${courseSlug}`
    : currentLessonData
      ? `/sandbox?lesson=${currentLessonData.id}&course=${courseSlug}`
      : null

  const sandboxNote = useMemo(() => {
    const outline = (course as any)?.metadata?.outline
    if (!Array.isArray(outline)) return null

    const normalize = (str?: string | null) => (str || '').trim().toLowerCase()
    const targets = [
      normalize(currentSubtopicData?.title),
      normalize(currentTopicData?.title),
      normalize(currentLessonData?.title)
    ].filter(Boolean)

    const findMatchingNote = (topics: any[]) => {
      for (const topic of topics || []) {
        const topicTitle = normalize(topic?.title)
        const topicSub = normalize(topic?.subheading)
        if (topic?.sandboxContent && targets.some((t: string) => t === topicTitle || t === topicSub)) {
          return topic.sandboxContent as string
        }
      }
      return null
    }

    for (const section of outline) {
      const note = findMatchingNote(section?.topics || [])
      if (note) return note
    }

    // Fallback: first sandbox note anywhere in outline
    for (const section of outline) {
      const topicWithSandbox = (section?.topics || []).find((t: any) => t?.sandboxContent)
      if (topicWithSandbox?.sandboxContent) return topicWithSandbox.sandboxContent as string
    }

    return null
  }, [course, currentLessonData, currentSubtopicData, currentTopicData])
  
  // Calculate progress based on completed subtopics
  const totalSubtopics = lessons.reduce((total, lesson) => {
    return total + (lesson.topics?.reduce((topicTotal, topic) => {
      return topicTotal + topic.subtopics.length
    }, 0) || 0)
  }, 0)
  
  const progress = totalSubtopics > 0 ? (completedSubtopics.length / totalSubtopics) * 100 : 0

  if (!courseSlug) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Invalid course</div>
      </div>
    )
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Course not found or access denied</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    )
  }

  if (!course || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Course not found or no lessons available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Course
            </button>
            <div>
              <h1 className="text-xl font-bold">{course.title}</h1>
              <p className="text-gray-400 text-sm">{course.level} • {course.duration}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="font-semibold">{Math.round(progress)}%</p>
            </div>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hierarchical Lesson Structure */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="space-y-1">
                  {/* Lesson Header */}
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentLesson === lessonIndex 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getLessonIcon(lesson.content?.type || 'reading')}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-400">{lesson.module?.title || 'General'}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{lesson.estimatedMinutes || 15} min</span>
                    </div>
                  </div>

                  {/* Topics and Subtopics */}
                  {lesson.topics && lesson.topics.length > 0 && currentLesson === lessonIndex && (
                    <div className="ml-4 space-y-1">
                      {lesson.topics.map((topic, topicIndex) => (
                        <div key={topic.id} className="space-y-1">
                          {/* Topic Header */}
                          <div
                            onClick={() => toggleTopic(topicIndex)}
                            className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between ${
                              currentTopic === topicIndex 
                                ? 'bg-purple-600/50 text-white' 
                                : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <ChevronRight 
                                className={`w-4 h-4 transition-transform ${
                                  expandedTopics.has(topicIndex) ? 'rotate-90' : ''
                                }`} 
                              />
                              <span className="text-sm font-medium">{topic.title}</span>
                            </div>
                            <span className="text-xs text-gray-300">{topic.estimatedMinutes}min</span>
                          </div>

                          {/* Subtopics */}
                          {expandedTopics.has(topicIndex) && (
                            <div className="ml-4 space-y-1">
                              {topic.subtopics.map((subtopic, subtopicIndex) => (
                                <div
                                  key={subtopic.id}
                                  onClick={() => navigateToSubtopic(lessonIndex, topicIndex, subtopicIndex)}
                                  className={`p-2 rounded cursor-pointer transition-colors ${
                                    currentTopic === topicIndex && currentSubtopic === subtopicIndex
                                      ? 'bg-green-600 text-white' 
                                      : 'bg-gray-500 hover:bg-gray-400'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="flex-shrink-0">
                                        {completedSubtopics.includes(subtopic.id) ? (
                                          <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                          getLessonIcon(subtopic.content?.type || 'reading')
                                        )}
                                      </div>
                                      <span className="text-xs">{subtopic.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-300">{subtopic.estimatedMinutes}min</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fallback for lessons without topics */}
                  {(!lesson.topics || lesson.topics.length === 0) && currentLesson === lessonIndex && (
                    <div className="ml-4 p-2 bg-gray-600 rounded text-xs text-gray-300">
                      Traditional lesson structure
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 bg-gray-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              {/* Display current subtopic content if available */}
              {currentSubtopicData ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      {getLessonIcon(currentSubtopicData.content?.type || 'reading')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentSubtopicData.title}</h3>
                      <p className="text-blue-400">
                        {currentTopicData?.title} • {currentSubtopicData.estimatedMinutes} min
                      </p>
                    </div>
                  </div>

                  {/* Subtopic Description */}
                  {currentSubtopicData.description && (
                    <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <p className="text-gray-300">{currentSubtopicData.description}</p>
                    </div>
                  )}

                  {sandboxNote && baseSandboxUrl && (
                    <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/40 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-purple-300" />
                            Sandbox Notes
                          </h4>
                          <p className="text-sm text-purple-100 whitespace-pre-line">{sandboxNote}</p>
                        </div>
                        <button
                          onClick={() => window.open(baseSandboxUrl, '_blank')}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
                        >
                          Open Sandbox
                        </button>
                      </div>
                    </div>
                  )}

                  {/* YouTube Video (if admin has added one) */}
                  {currentSubtopicData.content?.youtubeId && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Video className="w-5 h-5 text-red-500" />
                        <h4 className="text-lg font-semibold text-white">Video Explanation</h4>
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                          By Instructor
                        </span>
                      </div>
                      <YouTubeEmbed 
                        videoId={currentSubtopicData.content.youtubeId}
                        title={`${currentSubtopicData.title} - Video Lesson`}
                        showControls={true}
                      />
                      <p className="text-gray-400 text-sm mt-2 text-center">
                        📺 Watch the video explanation, then read the detailed content below
                      </p>
                    </div>
                  )}
                  
                  {/* Theory Content */}
                  {currentSubtopicData.content?.theory && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <h4 className="text-lg font-semibold text-white">Content</h4>
                      </div>
                      <div className="prose prose-invert prose-blue max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentSubtopicData.content.theory }} />
                      </div>
                    </div>
                  )}

                  {/* Enhanced Code Example */}
                  {currentSubtopicData.content?.codeExample && (
                    <div className="mb-8">
                      <EnhancedCodeExample
                        html={currentSubtopicData.content.codeExample.html}
                        css={currentSubtopicData.content.codeExample.css}
                        js={currentSubtopicData.content.codeExample.js}
                        title="Live Code Example"
                        description="Interactive example with copy/paste functionality"
                        difficulty="beginner"
                        onSandbox={() => {
                          const sandboxUrl = `/sandbox?subtopic=${currentSubtopicData.id}&lesson=${currentLessonData?.id}&course=${courseSlug}`
                          window.open(sandboxUrl, '_blank')
                        }}
                        showPreview={true}
                      />
                    </div>
                  )}

                  {/* Subtopic Exercises */}
                  {currentSubtopicData.exercises && currentSubtopicData.exercises.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 mb-6 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-xl font-semibold text-white">Practice Exercises</h4>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                          Hands-on
                        </span>
                      </div>
                      {currentSubtopicData.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="mb-6 last:mb-0">
                          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h5 className="font-semibold text-white text-lg mb-2">{exercise.title}</h5>
                                <p className="text-gray-300 mb-4">{exercise.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                                  Exercise {index + 1}
                                </span>
                              </div>
                            </div>
                            
                            {/* Starter Code Preview */}
                            {exercise.starterCode.html && (
                              <div className="mb-4">
                                <CodeBlock
                                  code={exercise.starterCode.html}
                                  language="html"
                                  title="Starter Code"
                                  showCopy={true}
                                  showSandbox={true}
                                  onSandbox={() => {
                                    const sandboxUrl = `/sandbox?exercise=${index}&subtopic=${currentSubtopicData.id}&lesson=${currentLessonData?.id}&course=${courseSlug}`
                                    window.open(sandboxUrl, '_blank')
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  const sandboxUrl = `/sandbox?exercise=${index}&subtopic=${currentSubtopicData.id}&lesson=${currentLessonData?.id}&course=${courseSlug}`
                                  window.open(sandboxUrl, '_blank')
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <Code className="w-5 h-5" />
                                Start Exercise
                              </button>
                              
                              <button
                                onClick={() => {
                                  // Show solution in modal or expand
                                  alert('Solution would be shown here. In production, this would expand to show the solution code.')
                                }}
                                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors font-medium"
                              >
                                View Solution
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentLessonData?.quizQuestions?.length ? (
                    <div className="mt-10">
                      <LessonQuiz questions={currentLessonData.quizQuestions} />
                    </div>
                  ) : null}
                </>
              ) : (
                /* Fallback to traditional lesson content if no topics/subtopics */
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentLessonData?.title}</h3>
                      <p className="text-blue-400">{currentLessonData?.module?.title || 'General'} • {currentLessonData?.estimatedMinutes || 15} min</p>
                    </div>
                  </div>

                  {/* YouTube Video (if admin has added one) */}
                  {currentLessonData?.content?.youtubeId && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Video className="w-5 h-5 text-red-500" />
                        <h4 className="text-lg font-semibold text-white">Video Explanation</h4>
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                          By Instructor
                        </span>
                      </div>
                      <YouTubeEmbed 
                        videoId={currentLessonData.content.youtubeId}
                        title={`${currentLessonData?.title} - Video Lesson`}
                        showControls={true}
                      />
                      <p className="text-gray-400 text-sm mt-2 text-center">
                        📺 Watch the video explanation, then read the detailed content below
                      </p>
                    </div>
                  )}
                  
                  {/* Theory Content */}
                  {currentLessonData?.content?.theory && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                        <h4 className="text-lg font-semibold text-white">Lesson Content</h4>
                      </div>
                      <div className="prose prose-invert prose-blue max-w-none">
                        <ReactMarkdown 
                          components={{
                            h1: ({children}) => <h1 className="text-3xl font-bold text-white mb-4">{children}</h1>,
                            h2: ({children}) => <h2 className="text-2xl font-bold text-white mb-3 mt-6">{children}</h2>,
                            h3: ({children}) => <h3 className="text-xl font-bold text-white mb-2 mt-4">{children}</h3>,
                            p: ({children}) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                            ul: ({children}) => <ul className="text-gray-300 mb-4 ml-6 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="text-gray-300 mb-4 ml-6 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="list-disc">{children}</li>,
                            code: ({children}) => <code className="bg-gray-700 px-2 py-1 rounded text-blue-300 text-sm">{children}</code>,
                            pre: ({children}) => <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-700">{children}</pre>,
                            strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                            em: ({children}) => <em className="text-blue-300">{children}</em>,
                          }}
                        >
                          {currentLessonData.content.theory}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Code Example */}
                  {currentLessonData?.content?.codeExample && (
                    <div className="mb-8">
                      <EnhancedCodeExample
                        html={currentLessonData.content.codeExample.html}
                        css={currentLessonData.content.codeExample.css}
                        js={currentLessonData.content.codeExample.js}
                        title="Live Code Example"
                        description="Interactive example with copy/paste functionality"
                        difficulty="beginner"
                        onSandbox={() => {
                          const sandboxUrl = `/sandbox?example=true&lesson=${currentLessonData?.id}&course=${courseSlug}`
                          window.open(sandboxUrl, '_blank')
                        }}
                        showPreview={true}
                      />
                    </div>
                  )}

                  {/* Exercises */}
                  {currentLessonData?.exercises && currentLessonData.exercises.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 mb-6 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-xl font-semibold text-white">Practice Exercises</h4>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                          Hands-on
                        </span>
                      </div>
                      {currentLessonData.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="mb-6 last:mb-0">
                          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h5 className="font-semibold text-white text-lg mb-2">{exercise.title}</h5>
                                <p className="text-gray-300 mb-4">{exercise.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
                                  Exercise {index + 1}
                                </span>
                              </div>
                            </div>
                            
                            {/* Starter Code Preview */}
                            {exercise.starterCode.html && (
                              <div className="mb-4">
                                <CodeBlock
                                  code={exercise.starterCode.html}
                                  language="html"
                                  title="Starter Code"
                                  showCopy={true}
                                  showSandbox={true}
                                  onSandbox={() => {
                                    const sandboxUrl = `/sandbox?exercise=${index}&lesson=${currentLessonData?.id}&course=${courseSlug}`
                                    window.open(sandboxUrl, '_blank')
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  const sandboxUrl = `/sandbox?exercise=${index}&lesson=${currentLessonData?.id}&course=${courseSlug}`
                                  window.open(sandboxUrl, '_blank')
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <Code className="w-5 h-5" />
                                Start Exercise
                              </button>
                              
                              <button
                                onClick={() => {
                                  // Show solution in modal or expand
                                  alert('Solution would be shown here. In production, this would expand to show the solution code.')
                                }}
                                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors font-medium"
                              >
                                View Solution
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentLessonData?.quizQuestions?.length ? (
                    <div className="mt-10">
                      <LessonQuiz questions={currentLessonData.quizQuestions} />
                    </div>
                  ) : null}
                </>
              )}

              {/* Video Lesson */}
              {currentLessonData?.content?.type === 'video' && (
                <>
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-center">{currentLessonData?.title}</h3>
                  <p className="text-blue-400 mb-4 text-lg text-center">{currentLessonData?.module?.title || 'General'}</p>
                  
                  {currentLessonData?.description && (
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center">
                      {currentLessonData.description}
                    </p>
                  )}

                  {sandboxNote && baseSandboxUrl && (
                    <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500/40 rounded-lg max-w-3xl mx-auto">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-purple-300" />
                            Sandbox Notes
                          </h4>
                          <p className="text-sm text-purple-100 whitespace-pre-line text-left">{sandboxNote}</p>
                        </div>
                        <button
                          onClick={() => window.open(baseSandboxUrl, '_blank')}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
                        >
                          Open Sandbox
                        </button>
                      </div>
                    </div>
                  )}

                  {/* YouTube Video */}
                  {currentLessonData?.content?.youtubeId && (
                    <div className="mb-8">
                      <YouTubeEmbed 
                        videoId={currentLessonData.content.youtubeId}
                        title={currentLessonData.title}
                        showControls={true}
                      />
                    </div>
                  )}
                  
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-white">📹 Video Lesson Content:</h4>
                    <div className="text-gray-300 space-y-3">
                      <ul className="text-left space-y-2">
                        <li>• 📚 Theory and core concepts</li>
                        <li>• 💡 Practical examples and demonstrations</li>
                        <li>• ⭐ Best practices and professional tips</li>
                        <li>• ⚠️ Common mistakes to avoid</li>
                        <li>• 🎯 Real-world applications</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* Exercise Lesson */}
              {currentLessonData?.content?.type === 'exercise' && (
                <>
                  <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Code className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-center">{currentLessonData?.title}</h3>
                  <p className="text-orange-400 mb-4 text-lg text-center">{currentLessonData?.module?.title || 'General'}</p>
                  
                  {currentLessonData?.description && (
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center">
                      {currentLessonData.description}
                    </p>
                  )}
                  
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-white">🛠️ Hands-on Exercise:</h4>
                    <div className="text-gray-300 space-y-3">
                      <ul className="text-left space-y-2">
                        <li>• 💻 Interactive coding exercises</li>
                        <li>• 📝 Step-by-step coding guidance</li>
                        <li>• 🧩 Practice problems to solve</li>
                        <li>• 🔍 Code review and feedback</li>
                        <li>• 🚀 Use the sandbox to practice</li>
                      </ul>
                      
                      <div className="mt-4 p-4 bg-orange-900/30 border border-orange-500/30 rounded-lg">
                        <h5 className="font-semibold text-orange-300 mb-2">💡 Exercise Instructions:</h5>
                        <p className="text-sm text-orange-200">
                          Click &quot;Open Sandbox&quot; below to start coding! The sandbox will open with starter code 
                          and instructions specific to this lesson.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Project Lesson */}
              {currentLessonData?.content?.type === 'project' && (
                <>
                  <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-center">{currentLessonData?.title}</h3>
                  <p className="text-purple-400 mb-4 text-lg text-center">{currentLessonData?.module?.title || 'General'}</p>
                  
                  {currentLessonData?.description && (
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed text-center">
                      {currentLessonData.description}
                    </p>
                  )}
                  
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-white">🎯 Project Build:</h4>
                    <div className="text-gray-300 space-y-3">
                      <ul className="text-left space-y-2">
                        <li>• 🏗️ Complete project walkthrough</li>
                        <li>• 🌐 Real-world application building</li>
                        <li>• 📁 Portfolio-ready deliverable</li>
                        <li>• 🚀 Deployment and sharing guide</li>
                        <li>• 💼 Add to your professional portfolio</li>
                      </ul>
                      
                      <div className="mt-4 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                        <h5 className="font-semibold text-purple-300 mb-2">🎯 Project Goals:</h5>
                        <p className="text-sm text-purple-200">
                          Build a complete, deployable project that demonstrates your skills. 
                          Use the sandbox to code and follow along with the project instructions.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <div className="text-gray-400 text-sm text-center">
                <p className="mb-2">
                  <strong>Duration:</strong> {currentLessonData?.estimatedMinutes || 15} min • <strong>Type:</strong> {
                    currentLessonData?.content?.type === 'reading' ? '📖 Reading & Practice' :
                    currentLessonData?.content?.type === 'video' ? '📹 Video Lesson' : 
                    currentLessonData?.content?.type === 'exercise' ? '🛠️ Hands-on Exercise' : 
                    '🎯 Project Build'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousSubtopic}
                disabled={currentLesson === 0 && currentTopic === 0 && currentSubtopic === 0}
                className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-4">
                {/* Lesson Resources */}
                {currentSubtopicData?.content && (
                  <button
                    onClick={() => alert('Sub-topic resources would be downloaded here')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <BookOpen className="w-4 h-4 mr-2 inline" />
                    Resources
                  </button>
                )}

                {/* Sandbox Button for coding content */}
                {(currentSubtopicData?.content?.type === 'exercise' || currentSubtopicData?.content?.type === 'project' || currentSubtopicData?.exercises?.length > 0) && (
                  <button
                    onClick={() => {
                      const sandboxUrl = `/sandbox?subtopic=${currentSubtopicData?.id}&lesson=${currentLessonData?.id}&course=${courseSlug}`
                      window.open(sandboxUrl, '_blank')
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Code className="w-4 h-4 mr-2 inline" />
                    Open Sandbox
                  </button>
                )}

                {/* Mark Complete Button */}
                {currentSubtopicData && (
                  <button
                    onClick={() => toggleSubtopicComplete(currentSubtopicData.id)}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg transition-all duration-200 font-semibold min-w-[140px] ${
                      completedSubtopics.includes(currentSubtopicData.id)
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </div>
                    ) : completedSubtopics.includes(currentSubtopicData.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        Completed
                      </>
                    ) : (
                      'Mark Complete'
                    )}
                  </button>
                )}
              </div>

              <button
                onClick={goToNextSubtopic}
                disabled={
                  currentLesson === lessons.length - 1 && 
                  currentTopic === (currentLessonData?.topics?.length || 1) - 1 && 
                  currentSubtopic === (currentTopicData?.subtopics?.length || 1) - 1
                }
                className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>
                  {currentSubtopicData ? (
                    `${currentTopicData?.title} → ${currentSubtopicData.title}`
                  ) : (
                    `Lesson ${currentLesson + 1} of ${lessons.length}`
                  )}
                </span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Completion Message */}
              {progress === 100 && (
                <div className="mt-3 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                  <div className="flex items-center text-green-300">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Congratulations! You&apos;ve completed this course! 🎉</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
