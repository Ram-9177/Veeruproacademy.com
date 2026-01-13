import { useCallback, useState } from 'react'

interface UploadOptions {
  maxSize?: number
  endpoint?: 'projectThumbnail' | 'courseThumbnail' | 'lessonMedia' | 'cmsMedia'
  onProgress?: (_progress: number) => void
  onError?: (_error: Error) => void
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadFiles = useCallback(async (files: File[], options: UploadOptions = {}) => {
    const {
      endpoint = 'projectThumbnail',
      onProgress: _onProgress,
      onError: _onError,
    } = options

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(
        `/api/uploadthing?actionType=upload&slug=${endpoint}`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      _onProgress?.(100)
      return data

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      setUploadError(err.message)
      _onError?.(err)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [])

  return {
    uploadFiles,
    isUploading,
    uploadError,
    clearError: () => setUploadError(null),
  }
}
