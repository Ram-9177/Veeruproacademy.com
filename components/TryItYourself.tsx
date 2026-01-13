"use client"

import { useEffect, useMemo, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type SupportedLanguage = 'html' | 'css' | 'js' | 'javascript' | 'react'

interface TryItYourselfProps {
  initialCode: string
  language?: SupportedLanguage
  title?: string
  description?: string
  className?: string
}

function buildHtmlDocument(source: string): string {
  const containsHtmlTag = /<html[\s>]/i.test(source)
  if (containsHtmlTag) return source

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Preview</title>
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 24px; margin: 0; }
  </style>
</head>
<body>
${source}
</body>
</html>`
}

function buildCssDocument(source: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>CSS Preview</title>
  <style>
${source}
  </style>
</head>
<body style="font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 24px;">
  <h1>Styled Heading</h1>
  <p>This paragraph helps you preview the current CSS rules.</p>
  <button class="preview-button">Sample Button</button>
  <div class="preview-card">Custom element</div>
</body>
</html>`
}

function buildJsDocument(source: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>JavaScript Preview</title>
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; }
    #app { padding: 24px; }
    #console { background: #111827; color: #f3f4f6; margin: 0; padding: 24px; overflow-y: auto; height: 100%; }
    #console .log { color: #f3f4f6; }
    #console .warn { color: #facc15; }
    #console .error { color: #f87171; }
  </style>
</head>
<body>
  <div id="app">Open the console area to see results.</div>
  <pre id="console"></pre>
  <script>
    (function(){
      const consoleOut = document.getElementById('console')
      const write = (type, value) => {
        const entry = document.createElement('div')
        entry.className = type
        entry.textContent = value
        consoleOut.appendChild(entry)
      }
      ['log','info','warn','error'].forEach(kind => {
        const original = console[kind]
        console[kind] = function(...args){
          const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
          write(kind === 'info' ? 'log' : kind, message)
          original.apply(console, args)
        }
      })
      try {
        ${source}
      } catch (error) {
        write('error', error.message)
      }
    })()
  </script>
</body>
</html>`
}

function buildReactDocument(source: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>React Preview</title>
  <style>
    html, body { margin: 0; padding: 0; height: 100%; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f8fafc; padding: 24px; }
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    try {
${source}
      if (typeof renderExample === 'function') {
        const root = ReactDOM.createRoot(document.getElementById('root'))
        renderExample(root)
      } else {
        const component = typeof Example !== 'undefined' ? Example : (typeof App !== 'undefined' ? App : null)
        if (component) {
          ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(component))
        }
      }
    } catch (error) {
      const pre = document.createElement('pre')
      pre.style.background = '#fee2e2'
      pre.style.color = '#991b1b'
      pre.style.padding = '16px'
      pre.style.borderRadius = '8px'
      pre.textContent = error.message
      document.body.innerHTML = ''
      document.body.appendChild(pre)
    }
  </script>
</body>
</html>`
}

function buildPreviewDocument(source: string, language: SupportedLanguage): string {
  switch (language) {
    case 'html':
      return buildHtmlDocument(source)
    case 'css':
      return buildCssDocument(source)
    case 'js':
    case 'javascript':
      return buildJsDocument(source)
    case 'react':
      return buildReactDocument(source)
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}

export function TryItYourself({
  initialCode,
  language = 'html',
  title = 'Try it Yourself',
  description,
  className
}: TryItYourselfProps) {
  const normalizedLanguage = useMemo<SupportedLanguage>(() => {
    const value = (language || 'html').toLowerCase()
    if (value === 'javascript') return 'js'
    return (['html', 'css', 'js', 'react'] as SupportedLanguage[]).includes(value as SupportedLanguage)
      ? (value as SupportedLanguage)
      : 'html'
  }, [language])

  const [code, setCode] = useState(initialCode)
  const [outputDoc, setOutputDoc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [runVersion, setRunVersion] = useState(0)

  useEffect(() => {
    setCode(initialCode)
    try {
      setOutputDoc(buildPreviewDocument(initialCode, normalizedLanguage))
      setError(null)
      setRunVersion((version) => version + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to render preview')
    }
  }, [initialCode, normalizedLanguage])

  const runCode = () => {
    try {
      setOutputDoc(buildPreviewDocument(code, normalizedLanguage))
      setError(null)
      setRunVersion((version) => version + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to render preview')
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    try {
      setOutputDoc(buildPreviewDocument(initialCode, normalizedLanguage))
      setError(null)
      setRunVersion((version) => version + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to render preview')
    }
  }

  const languageLabel = useMemo(() => {
    switch (normalizedLanguage) {
      case 'html':
        return 'HTML'
      case 'css':
        return 'CSS'
      case 'js':
        return 'JavaScript'
      case 'react':
        return 'React'
      default:
        return 'Sandbox'
    }
  }, [normalizedLanguage])

  const shouldUseIframe = ['html', 'css', 'js', 'react'].includes(normalizedLanguage)

  return (
    <section
      className={cn(
      'my-10 rounded-2xl border border-emerald-200 bg-card shadow-lg shadow-emerald-50 transition-colors md:my-12',
        className
      )}
    >
          <div className="rounded-t-2xl bg-emerald-600 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-emerald-100">{description}</p>}
          </div>
          <span className="rounded-full bg-surface/40 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
            {languageLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="space-y-3">
          <label htmlFor="try-it-editor" className="text-sm font-semibold text-muted">
            Code Editor
          </label>
          <textarea
            id="try-it-editor"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            className="min-h-[220px] w-full resize-vertical rounded-xl border border-border bg-surface/90 p-4 font-mono text-sm text-foreground shadow-inner focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-100 sm:min-h-[260px]"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runCode}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-500 focus:outline-none focus:ring focus:ring-emerald-200"
          >
            <Play className="h-4 w-4" />
            Run
          </button>
          <button
            type="button"
            onClick={resetCode}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-emerald-300 hover:text-emerald-600 focus:outline-none focus:ring focus:ring-emerald-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">Result</p>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-inner">
            {shouldUseIframe ? (
              <iframe
                key={runVersion}
                title={`${title} preview`}
                srcDoc={outputDoc}
                sandbox="allow-scripts allow-same-origin"
                className="h-[260px] w-full bg-card md:h-[320px]"
              />
            ) : (
              <pre className="bg-slate-900 p-4 text-sm text-slate-100">
                <code>{code}</code>
              </pre>
            )}
          </div>
          {normalizedLanguage === 'react' && (
            <p className="text-xs text-slate-500">
              Tip: Define a component named <code className="font-mono text-emerald-600">Example</code> or
              <code className="font-mono text-emerald-600"> App</code>, or export a <code className="font-mono text-emerald-600">renderExample</code>
              function to control the React preview.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default TryItYourself
