'use client'

import { useState } from 'react'
import { Copy, Check, Play, Edit, ExternalLink } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language: string
  title?: string
  showCopy?: boolean
  showSandbox?: boolean
  showEdit?: boolean
  onEdit?: () => void
  onSandbox?: () => void
}

export function CodeBlock({ 
  code, 
  language, 
  title, 
  showCopy = true, 
  showSandbox = false,
  showEdit = false,
  onEdit,
  onSandbox 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="relative group">
      {/* Header */}
      {(title || showCopy || showSandbox || showEdit) && (
        <div className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-t-lg border-b border-gray-600">
          <div className="flex items-center gap-2">
            {title && (
              <span className="text-sm font-semibold text-gray-300">{title}</span>
            )}
            <span className="text-xs text-gray-400 uppercase tracking-wide">{language}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {showEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                title="Edit in Sandbox"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            
            {showSandbox && (
              <button
                onClick={onSandbox}
                className="p-1.5 rounded hover:bg-purple-600 text-gray-400 hover:text-white transition-colors"
                title="Open in Sandbox"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            
            {showCopy && (
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                title={copied ? 'Copied!' : 'Copy code'}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Code Content */}
      <div className="relative">
        <pre className={`bg-gray-900 p-4 overflow-x-auto text-sm leading-relaxed ${
          title || showCopy || showSandbox || showEdit ? 'rounded-b-lg' : 'rounded-lg'
        } border border-gray-700`}>
          <code className={`language-${language} text-gray-300`}>
            {code}
          </code>
        </pre>
        
        {/* Hover overlay for quick actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            {showSandbox && (
              <button
                onClick={onSandbox}
                className="p-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
                title="Try in Sandbox"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}