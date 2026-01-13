'use client'

import { useState, useRef } from 'react'
import { Save } from 'lucide-react'

interface RealtimeSandboxProps {
  initialHtml?: string
  initialCss?: string
  initialJs?: string
  onSave?: (_code: { html: string; css: string; js: string }) => void
  className?: string
}

export function RealtimeSandbox({
  initialHtml = '',
  initialCss = '',
  initialJs = '',
  onSave,
  className = ''
}: RealtimeSandboxProps) {
  const [html, setHtml] = useState(initialHtml)
  const [css, setCss] = useState(initialCss)
  const [js, setJs] = useState(initialJs)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleSave = () => {
    if (onSave) {
      onSave({ html, css, js })
    }
  }

  const tabs = [
    { id: 'html' as const, label: 'HTML' },
    { id: 'css' as const, label: 'CSS' },
    { id: 'js' as const, label: 'JavaScript' }
  ]

  return (
    <div className={`flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="text-white font-semibold">Live Sandbox</h3>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-1/2 border-r border-gray-700">
          <div className="flex bg-gray-800 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 bg-gray-700'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {activeTab === 'html' && (
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none border-none outline-none"
                placeholder="Enter your HTML here..."
                spellCheck={false}
              />
            )}
            {activeTab === 'css' && (
              <textarea
                value={css}
                onChange={(e) => setCss(e.target.value)}
                className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none border-none outline-none"
                placeholder="Enter your CSS here..."
                spellCheck={false}
              />
            )}
            {activeTab === 'js' && (
              <textarea
                value={js}
                onChange={(e) => setJs(e.target.value)}
                className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none border-none outline-none"
                placeholder="Enter your JavaScript here..."
                spellCheck={false}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col w-1/2">
          <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
            <h4 className="text-white font-medium">Preview</h4>
          </div>
          <iframe
            ref={iframeRef}
            className="flex-1 w-full bg-white"
            title="Sandbox Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}