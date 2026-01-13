'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AttractiveBackground } from '../../../components/AttractiveBackground'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Code,
  FileText,
  Video,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { ThumbnailInput } from '@/components/admin/ThumbnailInput'

interface ContentFormData {
  title: string
  type: 'page' | 'lesson' | 'project' | 'tutorial'
  status: 'published' | 'draft' | 'archived'
  courseSlug?: string
  category?: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedHours?: number
  technologies?: string[]
  content: string
  excerpt: string
  thumbnail?: string
  metadata: {
    seoTitle?: string
    seoDescription?: string
    tags?: string[]
  }
}


export const dynamic = 'force-dynamic'
export default function NewContentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    type: 'lesson',
    status: 'draft',
    content: '',
    excerpt: '',
    technologies: [],
    metadata: {
      tags: []
    }
  })
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newTechnology, setNewTechnology] = useState('')
  const [newTag, setNewTag] = useState('')

  const handleInputChange = (field: keyof ContentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMetadataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }))
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies?.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology.trim()]
      }))
      setNewTechnology('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.metadata.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          tags: [...(prev.metadata.tags || []), newTag.trim()]
        }
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tags: prev.metadata.tags?.filter(t => t !== tag) || []
      }
    }))
  }

  const handleSave = async (targetStatus: 'draft' | 'published') => {
    // Handle redirects for specific types that have their own creators
    if (formData.type === 'lesson') {
      if (confirm('Lessons should be created within a specific course. Redirect to Lesson Creator?')) {
        router.push('/admin/lessons/new')
      }
      return
    }
    if (formData.type === 'project') {
      if (confirm('Projects have their own dedicated creator. Redirect to Project Creator?')) {
        router.push('/admin/projects/new')
      }
      return
    }

    setIsSaving(true)
    
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        // If type is 'tutorial', we can map it to CmsPage but maybe add a tag or prefix
        // For now, we treat 'page' and 'tutorial' as CmsPage
        description: formData.excerpt,
        status: targetStatus === 'published' ? 'PUBLISHED' : 'DRAFT',
        slug: formData.metadata.seoTitle ? formData.metadata.seoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined
      }

      const response = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        alert('Content saved successfully!')
        router.push('/admin/content')
      } else {
        throw new Error(result.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return Video
      case 'project': return Code
      case 'tutorial': return FileText
      case 'page': return ImageIcon
      default: return FileText
    }
  }

  const TypeIcon = getTypeIcon(formData.type)

  return (
    <div className="min-h-screen relative bg-background">
      <AttractiveBackground />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/content"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TypeIcon className="w-6 h-6" />
                  <h1 className="text-3xl font-bold">Create New Content</h1>
                </div>
                <p className="text-white/90">
                  Create engaging content for your students
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={isSaving || !formData.title || !formData.content}
                className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {isPreview ? (
          /* Preview Mode */
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <TypeIcon className="w-8 h-8 text-blue-400" />
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-semibold capitalize">
                    {formData.type}
                  </span>
                  {formData.difficulty && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-sm font-semibold">
                      {formData.difficulty}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {formData.title || 'Untitled Content'}
                </h1>
                {formData.excerpt && (
                  <p className="text-xl text-white/70 mb-6">{formData.excerpt}</p>
                )}
                {formData.technologies && formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none text-white">
                <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter content title..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Content Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="lesson">Lesson</option>
                        <option value="project">Project</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="page">Page</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      rows={3}
                      placeholder="Brief description of the content..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Content</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <FileText className="w-4 h-4" />
                    <span>Supports HTML and Markdown</span>
                  </div>
                  
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={20}
                    placeholder="Write your content here... You can use HTML tags and Markdown syntax."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              {/* Project-specific fields */}
              {(formData.type === 'project' || formData.type === 'lesson') && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    {formData.type === 'project' ? 'Project' : 'Lesson'} Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty || ''}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        value={formData.estimatedHours || ''}
                        onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || undefined)}
                        placeholder="e.g., 8"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-white mb-2">
                      Technologies
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        placeholder="Add technology..."
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                      />
                      <button
                        onClick={addTechnology}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technologies?.map((tech) => (
                        <span key={tech} className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-sm">
                          {tech}
                          <button
                            onClick={() => removeTechnology(tech)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Course Association */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Course Association</h3>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Course Slug (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.courseSlug || ''}
                    onChange={(e) => handleInputChange('courseSlug', e.target.value)}
                    placeholder="e.g., nextjs-fullstack"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Media */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Media</h3>
                
                <ThumbnailInput
                  value={formData.thumbnail || ''}
                  onChange={(url) => handleInputChange('thumbnail', url)}
                  label="Content Thumbnail"
                  required={false}
                  uploadEndpoint="cmsMedia"
                />
              </div>

              {/* SEO & Metadata */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">SEO & Metadata</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.metadata.seoTitle || ''}
                      onChange={(e) => handleMetadataChange('seoTitle', e.target.value)}
                      placeholder="SEO optimized title..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={formData.metadata.seoDescription || ''}
                      onChange={(e) => handleMetadataChange('seoDescription', e.target.value)}
                      rows={3}
                      placeholder="SEO meta description..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.metadata.tags?.map((tag) => (
                        <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
