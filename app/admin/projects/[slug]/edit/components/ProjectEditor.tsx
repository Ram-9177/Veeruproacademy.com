'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/app/components/Button'
import { Save, Eye, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { ThumbnailUpload } from './ThumbnailUpload'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  tools: z.array(z.string()).optional().default([]),
  includes: z.array(z.string()).optional().default([]),
  driveUrl: z.string().url().optional().or(z.literal('')).nullable(),
  upiId: z.string().optional().nullable(),
  formUrl: z.string().url().optional().or(z.literal('')).nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']),
  featured: z.boolean().optional().default(false),
  thumbnail: z.string().optional().nullable(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectEditorProps {
  project: any
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [thumbnail, setThumbnail] = useState(project.thumbnail || '')
  const [tools, setTools] = useState<string[]>(project.tools || [])
  const [toolInput, setToolInput] = useState('')
  const [includes, setIncludes] = useState<string[]>(project.includes || [])
  const [includeInput, setIncludeInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      level: project.level || '',
      category: project.category || '',
      price: project.price || 0,
      tools: project.tools || [],
      includes: project.includes || [],
      driveUrl: project.driveUrl || '',
      upiId: project.upiId || '',
      formUrl: project.formUrl || '',
      status: project.status || 'DRAFT',
      featured: project.featured || false,
      thumbnail: project.thumbnail || '',
    },
  })

  const handleAddTool = () => {
    if (toolInput.trim()) {
      const newTools = [...tools, toolInput.trim()]
      setTools(newTools)
      setValue('tools', newTools)
      setToolInput('')
    }
  }

  const handleRemoveTool = (index: number) => {
    const newTools = tools.filter((_, i) => i !== index)
    setTools(newTools)
    setValue('tools', newTools)
  }

  const handleAddInclude = () => {
    if (includeInput.trim()) {
      const newIncludes = [...includes, includeInput.trim()]
      setIncludes(newIncludes)
      setValue('includes', newIncludes)
      setIncludeInput('')
    }
  }

  const handleRemoveInclude = (index: number) => {
    const newIncludes = includes.filter((_, i) => i !== index)
    setIncludes(newIncludes)
    setValue('includes', newIncludes)
  }

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true)
    try {
      const url = project.id ? `/api/admin/projects/${project.id}` : '/api/admin/projects'
      const method = project.id ? 'PATCH' : 'POST'

      const payload = {
        ...data,
        thumbnail: thumbnail || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.refresh()
        router.push('/admin/projects')
      } else {
        const error = await response.json()
        alert(`Failed to save project: ${error.message}`)
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              {project.id ? 'Edit Project' : 'New Project'}
            </h1>
            <p className="text-neutral-600 mt-1">Create or update project details, content, and delivery settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.slug && (
            <Link href={`/projects/${project.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Basic Information</h2>
            <p className="text-sm text-neutral-500 mt-1">Project title, slug, and metadata</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Slug *
              </label>
              <input
                {...register('slug')}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Brief description of what this project teaches and includes"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail & Media */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Media & Display</h2>
            <p className="text-sm text-neutral-500 mt-1">Thumbnail, level, category, and visibility</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <ThumbnailUpload
                initialThumbnail={thumbnail}
                onUpload={(url) => {
                  setThumbnail(url)
                  setValue('thumbnail', url)
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Level
              </label>
              <select
                {...register('level')}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category
              </label>
              <input
                {...register('category')}
                placeholder="e.g., Web Design, UI/UX, Development"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              <p className="text-xs text-neutral-500 mt-1">Set to 0 for free projects</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
                <option value="SCHEDULED">Scheduled</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <span className="text-sm font-medium text-neutral-700">Featured Project</span>
              </label>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Project Content</h2>
            <p className="text-sm text-neutral-500 mt-1">Tools used and what&apos;s included</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Tools & Technologies
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTool())}
                placeholder="e.g., Figma, React, Tailwind"
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTool}
                className="min-h-[44px]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  <span className="text-sm font-medium text-emerald-700">{tool}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(index)}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              What&apos;s Included
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                placeholder="e.g., Source files, Design system, Documentation"
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddInclude}
                className="min-h-[44px]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {includes.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <span className="text-sm font-medium text-blue-700">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInclude(index)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery & Links */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Delivery & Payment</h2>
            <p className="text-sm text-neutral-500 mt-1">Google Drive link, UPI ID, and form URL</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Google Drive Folder Link
              </label>
              <input
                type="url"
                {...register('driveUrl')}
                placeholder="https://drive.google.com/drive/folders/..."
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              <p className="text-xs text-neutral-500 mt-1">Link where project files are stored</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                {...register('upiId')}
                placeholder="yourname@upi"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              <p className="text-xs text-neutral-500 mt-1">For payment verification</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Form URL (Optional)
              </label>
              <input
                type="url"
                {...register('formUrl')}
                placeholder="https://forms.example.com/project"
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none min-h-[44px]"
              />
              <p className="text-xs text-neutral-500 mt-1">Review checklist, feedback form, or other form</p>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex gap-3 justify-end">
          <Link href="/admin/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="min-w-[150px]"
          >
            {saving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </form>
    </div>
  )
}




