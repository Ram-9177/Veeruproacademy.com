'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AttractiveBackground } from '@/app/components/AttractiveBackground'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  FileText,
  ImageIcon
} from 'lucide-react'
import Link from 'next/link'

interface ContentFormData {
  id: string
  title: string
  slug: string
  type: string
  status: 'published' | 'draft' | 'archived'
  content: string
}

export const dynamic = 'force-dynamic'

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<ContentFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/content/${params.id}`)
      if (response.ok) {
        const json = await response.json()
        if (json.success && json.data) {
          const data = json.data
          setFormData({
            id: data.id,
            title: data.title,
            slug: data.slug,
            type: data.type || 'page',
            status: data.status.toLowerCase(), // Ensure lowercase for select matching
            content: data.content || ''
          })
        }
      } else {
        console.error('Failed to fetch content')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleInputChange = (field: keyof ContentFormData, value: any) => {
    if (!formData) return
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  const handleSave = async () => {
    if (!formData) return
    setIsSaving(true)
    
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        status: formData.status
      }

      const response = await fetch(`/api/admin/content/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        alert('Content updated successfully!')
        router.push('/admin/content')
      } else {
        throw new Error(result.error || 'Failed to update content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
  }

  if (!formData) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Content not found</div>
  }

  return (
    <div className="min-h-screen relative bg-background">
      <AttractiveBackground />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/content"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <ImageIcon className="w-6 h-6 flex-shrink-0" />
                  <h1 className="text-2xl md:text-3xl font-bold break-all">Edit Content</h1>
                </div>
                <p className="text-white/90 text-sm md:text-base break-all">
                  Editing: {formData.title}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm md:text-base"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
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
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-sm font-semibold capitalize">
                    {formData.type}
                </span>
                <h1 className="text-4xl font-bold text-white my-4">
                  {formData.title}
                </h1>
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
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="url-slug"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                    />
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
                    placeholder="Write your content here..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
