'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/app/components/Button'
import { Save, Eye, ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ThumbnailInput } from '@/components/admin/ThumbnailInput'

const outlineTopicSchema = z.object({
  title: z.string().min(1, 'Topic title is required'),
  subheading: z.string().optional(),
  sandboxContent: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

const outlineSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  summary: z.string().optional(),
  topics: z.array(outlineTopicSchema).default([])
})

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  level: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().min(0).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']),
  thumbnail: z.string().url().optional().or(z.literal('')),
  metadata: z.object({
    outline: z.array(outlineSectionSchema).optional()
  }).catchall(z.any()).optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseEditorProps {
  course: any
}

export function CourseEditor({ course }: CourseEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const normalizedMetadata =
    course.metadata && typeof course.metadata === 'object' && !Array.isArray(course.metadata)
      ? course.metadata
      : {}
  const outlineDefaults = Array.isArray((course.metadata as any)?.outline) ? (course.metadata as any).outline : []

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      slug: course.slug,
      description: course.description || '',
      level: course.level || '',
      duration: course.duration || '',
      price: course.price || 0,
      status: course.status,
      thumbnail: course.thumbnail || '',
      metadata: {
        ...normalizedMetadata,
        outline: outlineDefaults
      }
    }
  })

  const { fields: outlineFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: 'metadata.outline'
  })

  const onSubmit = async (data: CourseFormData) => {
    setSaving(true)
    try {
      const url = course.id ? `/api/admin/courses/${course.id}` : '/api/admin/courses'
      const method = course.id ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        router.refresh()
        router.push('/admin/courses')
      } else {
        alert('Failed to save course')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {course.id ? 'Edit Course' : 'New Course'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 mt-1">
              {course.id ? 'Update course details and settings' : 'Create a new course'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/version-history/COURSE/${course.id}`}>
            <Button variant="outline" size="sm">
              History
            </Button>
          </Link>
          <Link href={`/courses/${course.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-900 rounded-xl border border-neutral-200 dark:border-gray-800 p-6 shadow-sm space-y-6 transition-colors"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Title *
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none min-h-[44px] transition-colors"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Slug *
            </label>
            <input
              {...register('slug')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none min-h-[44px] transition-colors"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Level
            </label>
            <select
              {...register('level')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none min-h-[44px] transition-colors"
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Duration
            </label>
            <input
              {...register('duration')}
              placeholder="e.g., 4 weeks"
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none min-h-[44px] transition-colors"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <ThumbnailInput
              value={watch('thumbnail') || ''}
              onChange={(url) => setValue('thumbnail', url)}
              label="Course Thumbnail"
              required={false}
              uploadEndpoint="courseThumbnail"
              className="[&_label]:text-neutral-700 [&_input]:bg-white [&_input]:text-neutral-900 [&_input]:border-neutral-300 [&_button]:bg-neutral-100 [&_button]:hover:bg-neutral-200 [&_button]:text-neutral-900 dark:[&_label]:text-neutral-200 dark:[&_input]:bg-gray-900 dark:[&_input]:text-neutral-100 dark:[&_input]:border-gray-700 dark:[&_button]:bg-gray-800 dark:[&_button]:hover:bg-gray-700 dark:[&_button]:text-neutral-100 transition-colors"
            />
          </div>
        </div>

        {/* Course Outline Builder */}
        <div className="border-t border-neutral-200 pt-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Course Outline & Media</h2>
              <p className="text-sm text-neutral-600">
                Define headings, sub-topics, sandbox notes, and attach image/video links for each topic.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendSection({
                  heading: 'New Section',
                  summary: '',
                  topics: [
                    { title: 'Topic 1', subheading: '', sandboxContent: '', videoUrl: '', imageUrl: '' }
                  ]
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          {outlineFields.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-sm text-neutral-600">
              No outline yet. Add a section to start structuring this course.
            </div>
          )}

          <div className="space-y-4">
            {outlineFields.map((section, sectionIndex) => (
              <div key={section.id} className="rounded-lg border border-neutral-200 p-4 space-y-4 bg-neutral-50">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Heading</label>
                      <input
                        {...register(`metadata.outline.${sectionIndex}.heading` as const)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="e.g., React Fundamentals"
                      />
                      {((errors.metadata?.outline as unknown as any[] | undefined)?.[sectionIndex]?.heading?.message) && (
                        <p className="text-sm text-red-600 mt-1">
                          {(errors.metadata?.outline as unknown as any[] | undefined)?.[sectionIndex]?.heading?.message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Section Summary</label>
                      <textarea
                        {...register(`metadata.outline.${sectionIndex}.summary` as const)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="What will learners achieve in this section?"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <OutlineTopics
                  control={control}
                  register={register}
                  sectionIndex={sectionIndex}
                  errors={errors}
                  setValue={setValue}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}

type OutlineTopicsProps = {
  control: any
  register: any
  sectionIndex: number
  errors: any
  setValue: any
}

function OutlineTopics({ control, register, sectionIndex, errors, setValue }: OutlineTopicsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `metadata.outline.${sectionIndex}.topics` as const
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">Topics</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ title: 'New Topic', subheading: '', sandboxContent: '', videoUrl: '', imageUrl: '' })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="rounded border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-600">
          No topics yet. Add a topic to this section.
        </div>
      )}

      <div className="space-y-3">
        {fields.map((topic, topicIndex) => (
          <div key={topic.id} className="rounded border border-neutral-200 bg-white p-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Topic Title</label>
                    <input
                      {...register(`metadata.outline.${sectionIndex}.topics.${topicIndex}.title` as const)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="e.g., JSX Basics"
                    />
                    {((errors.metadata?.outline as unknown as any[] | undefined)?.[sectionIndex]?.topics?.[topicIndex]?.title?.message) && (
                      <p className="text-xs text-red-600 mt-1">
                        {(errors.metadata?.outline as unknown as any[] | undefined)?.[sectionIndex]?.topics?.[topicIndex]?.title?.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Sub Topic</label>
                    <input
                      {...register(`metadata.outline.${sectionIndex}.topics.${topicIndex}.subheading` as const)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="Optional sub-topic or learning objective"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Sandbox / Lab Notes</label>
                  <textarea
                    {...register(`metadata.outline.${sectionIndex}.topics.${topicIndex}.sandboxContent` as const)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="Commands, snippets, or sandbox instructions"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      {...register(`metadata.outline.${sectionIndex}.topics.${topicIndex}.imageUrl` as const)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="https://example.com/image.png"
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setValue(
                            `metadata.outline.${sectionIndex}.topics.${topicIndex}.imageUrl` as const,
                            ''
                          )
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Video URL</label>
                    <input
                      type="url"
                      {...register(`metadata.outline.${sectionIndex}.topics.${topicIndex}.videoUrl` as const)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      placeholder="https://youtube.com/..."
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setValue(
                            `metadata.outline.${sectionIndex}.topics.${topicIndex}.videoUrl` as const,
                            ''
                          )
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(topicIndex)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
