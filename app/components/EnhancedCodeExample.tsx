'use client'

import { useState } from 'react'
import { Copy, Check, Play, Eye, Code, Lightbulb, Target, Zap } from 'lucide-react'
// import { CodeBlock } from './CodeBlock' // Unused import removed

interface EnhancedCodeExampleProps {
  html?: string
  css?: string
  js?: string
  title?: string
  description?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  onSandbox?: () => void
  showPreview?: boolean
}

export function EnhancedCodeExample({ 
  html = '', 
  css = '', 
  js = '', 
  title = 'Code Example',
  description,
  difficulty = 'beginner',
  onSandbox,
  showPreview = true
}: EnhancedCodeExampleProps) {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'preview'>('html')
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30'
    }
  }

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'beginner': return <Lightbulb className="w-4 h-4" />
      case 'intermediate': return <Target className="w-4 h-4" />
      case 'advanced': return <Zap className="w-4 h-4" />
    }
  }

  const tabs = [
    { id: 'html' as const, label: 'HTML', code: html, icon: <Code className="w-4 h-4" /> },
    { id: 'css' as const, label: 'CSS', code: css, icon: <Code className="w-4 h-4" /> },
    { id: 'js' as const, label: 'JavaScript', code: js, icon: <Code className="w-4 h-4" /> },
    ...(showPreview ? [{ id: 'preview' as const, label: 'Preview', code: '', icon: <Eye className="w-4 h-4" /> }] : [])
  ].filter(tab => tab.code || tab.id === 'preview')

  const createPreviewContent = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}</script>
</body>
</html>
    `.trim()
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
      {/* Header */}
      <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {description && (
                <p className="text-sm text-gray-400">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Difficulty Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getDifficultyColor()}`}>
              {getDifficultyIcon()}
              {difficulty}
            </div>
            
            {/* Sandbox Button */}
            {onSandbox && (
              <button
                onClick={onSandbox}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Try in Sandbox
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-750 border-b border-gray-600">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.code && (
                <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                  {tab.code.split('\n').length} lines
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {activeTab === 'preview' ? (
          <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-300 min-h-[300px] relative overflow-hidden">
              <iframe
                srcDoc={createPreviewContent()}
                className="w-full h-full min-h-[300px] border-0"
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin"
              />
              
              {/* Preview Controls */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => copyToClipboard(createPreviewContent(), 'preview')}
                  className="p-2 bg-black/20 hover:bg-black/40 text-white rounded transition-colors"
                  title="Copy HTML"
                >
                  {copied === 'preview' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <pre className="bg-gray-900 p-6 overflow-x-auto text-sm leading-relaxed">
              <code className={`language-${activeTab} text-gray-300`}>
                {tabs.find(tab => tab.id === activeTab)?.code || ''}
              </code>
            </pre>
            
            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(tabs.find(tab => tab.id === activeTab)?.code || '', activeTab)}
              className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
              title={copied === activeTab ? 'Copied!' : 'Copy code'}
            >
              {copied === activeTab ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-750 px-6 py-3 border-t border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Interactive Example</span>
            <span>•</span>
            <span>Copy & Paste Ready</span>
            <span>•</span>
            <span>Live Preview</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(`${html}\n\n${css}\n\n${js}`, 'all')}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
            >
              {copied === 'all' ? 'Copied All!' : 'Copy All'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}