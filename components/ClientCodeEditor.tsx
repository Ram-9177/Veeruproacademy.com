import React, { useState, useRef, useEffect } from 'react'

type Props = { initialHtml?: string; initialCss?: string; initialJs?: string }

export default function ClientCodeEditor({ initialHtml = '<h1>Hello</h1>', initialCss = 'body{font-family:sans-serif}', initialJs = '' }: Props) {
  const [html, setHtml] = useState(initialHtml)
  const [css, setCss] = useState(initialCss)
  const [js, setJs] = useState(initialJs)
  const [name, setName] = useState('')
  const [snapshots, setSnapshots] = useState<Array<any>>([])
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const htmlTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const cssTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const jsTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const STORAGE_KEY = 'vpac:sandbox:snapshots'

  useEffect(() => {
    const doc = iframeRef.current?.contentWindow?.document
    if (!doc) return
    // Inject a conservative Content-Security-Policy for the preview iframe to limit network access
    const DEFAULT_CSP = "default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; connect-src 'none'; frame-ancestors 'none';"
    const source = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${DEFAULT_CSP}"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}<script>${js}/*<![CDATA[*/</script></body></html>`
    doc.open()
    doc.write(source)
    doc.close()
  }, [html, css, js])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSnapshots(JSON.parse(raw))
    } catch (e) {
      // ignore parse errors
      console.debug('Failed to load sandbox snapshots', e)
    }
  }, [])

  function saveSnapshot() {
    const id = Date.now().toString()
    const snapshot = {
      id,
      name: name || `snippet-${new Date().toISOString()}`,
      html,
      css,
      js,
      createdAt: new Date().toISOString(),
    }
    const next = [snapshot, ...snapshots].slice(0, 50)
    setSnapshots(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (e) {
      console.debug('Failed to save snapshot', e)
    }
    setName('')
  }

  function loadSnapshot(id: string) {
    const s = snapshots.find(s => s.id === id)
    if (!s) return
    setHtml(s.html)
    setCss(s.css)
    setJs(s.js)
  }

  function deleteSnapshot(id: string) {
    const next = snapshots.filter(s => s.id !== id)
    setSnapshots(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (e) {
      console.debug('Failed to delete snapshot', e)
    }
  }

  function exportSnapshots() {
    const blob = new Blob([JSON.stringify(snapshots, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'veerpac-snapshots.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyBundle() {
    const bundle = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`
    navigator.clipboard.writeText(bundle).catch(() => {})
  }

  function downloadBundle() {
    const bundle = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`
    const blob = new Blob([bundle], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (name || 'sandbox') + '.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  function sharePermalink() {
    try {
      const payload = { h: html, c: css, j: js }
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      const url = new URL(window.location.href)
      url.searchParams.set('code', encoded)
      window.history.replaceState({}, '', url.toString())
    } catch (e) {
      console.debug('share encode failed', e)
    }
  }

  function importSnapshotsFromFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const parsed = JSON.parse(String(e.target?.result || '[]'))
        if (Array.isArray(parsed)) {
          // merge but avoid duplicate ids
          const byId = new Map<string, any>()
          ;[...parsed, ...snapshots].forEach(s => byId.set(s.id || JSON.stringify(s), s))
          const merged = Array.from(byId.values()).slice(0, 200)
          setSnapshots(merged)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        }
      } catch (err) {
        console.debug('Import failed', err)
      }
    }
    reader.readAsText(file)
  }

  // Keyboard navigation for editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to run preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        // Trigger preview update by focusing iframe
        iframeRef.current?.focus()
      }
      // Tab navigation between editors
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === htmlTextareaRef.current) {
        e.preventDefault()
        cssTextareaRef.current?.focus()
      } else if (e.key === 'Tab' && !e.shiftKey && document.activeElement === cssTextareaRef.current) {
        e.preventDefault()
        jsTextareaRef.current?.focus()
      } else if (e.key === 'Tab' && e.shiftKey && document.activeElement === jsTextareaRef.current) {
        e.preventDefault()
        cssTextareaRef.current?.focus()
      } else if (e.key === 'Tab' && e.shiftKey && document.activeElement === cssTextareaRef.current) {
        e.preventDefault()
        htmlTextareaRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="grid md:grid-cols-3 gap-4" role="region" aria-label="Code editor">
      <div>
        <label htmlFor="html-editor" className="text-xs font-medium">HTML</label>
        <textarea 
          id="html-editor"
          ref={htmlTextareaRef}
          className="w-full h-40 border rounded p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emeraldGreen-500 focus:border-emeraldGreen-500" 
          value={html} 
          onChange={e => setHtml(e.target.value)}
          aria-label="HTML code editor"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div>
        <label htmlFor="css-editor" className="text-xs font-medium">CSS</label>
        <textarea 
          id="css-editor"
          ref={cssTextareaRef}
          className="w-full h-40 border rounded p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emeraldGreen-500 focus:border-emeraldGreen-500" 
          value={css} 
          onChange={e => setCss(e.target.value)}
          aria-label="CSS code editor"
          role="textbox"
          tabIndex={0}
        />
      </div>
      <div>
        <label htmlFor="js-editor" className="text-xs font-medium">JS</label>
        <textarea 
          id="js-editor"
          ref={jsTextareaRef}
          className="w-full h-40 border rounded p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emeraldGreen-500 focus:border-emeraldGreen-500" 
          value={js} 
          onChange={e => setJs(e.target.value)}
          aria-label="JavaScript code editor"
          role="textbox"
          tabIndex={0}
        />
      </div>

      <div className="md:col-span-3 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <input
            placeholder="Snapshot name (optional)"
            className="border rounded px-2 py-1 text-sm"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button 
            className="btn btn-primary min-h-[44px] min-w-[44px] px-4" 
            onClick={saveSnapshot} 
            aria-label="Save snapshot"
          >
            Save
          </button>
          <button 
            className="btn min-h-[44px] min-w-[44px] px-4" 
            onClick={() => { setHtml(''); setCss(''); setJs('') }} 
            aria-label="Clear editor"
          >
            Clear
          </button>
          <button 
            className="btn min-h-[44px] min-w-[44px] px-4" 
            onClick={exportSnapshots} 
            aria-label="Export snapshots"
          >
            Export
          </button>
          <button
            className="btn min-h-[44px] min-w-[44px] px-4"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Import snapshots"
          >
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={e => importSnapshotsFromFile(e.target.files?.[0] || null)}
          />
          <button 
            className="btn min-h-[44px] min-w-[44px] px-4" 
            onClick={copyBundle} 
            aria-label="Copy bundle to clipboard"
          >
            Copy
          </button>
          <button 
            className="btn min-h-[44px] min-w-[44px] px-4" 
            onClick={downloadBundle} 
            aria-label="Download bundle HTML"
          >
            Download
          </button>
          <button 
            className="btn min-h-[44px] min-w-[44px] px-4" 
            onClick={sharePermalink} 
            aria-label="Generate shareable permalink"
          >
            Share
          </button>
        </div>

        <label className="text-xs">Preview</label>
        <div className="border rounded overflow-hidden mt-1">
          <iframe 
            ref={iframeRef} 
            title="Live preview of your code" 
            style={{ width: '100%', height: 360, border: 0 }} 
            sandbox="allow-scripts allow-same-origin"
            aria-label="Live preview of HTML, CSS, and JavaScript code"
            tabIndex={0}
          />
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium">Saved snapshots</h4>
          {snapshots.length === 0 && <p className="text-xs text-gray-500">No saved snapshots yet.</p>}
          <ul className="space-y-2 mt-2">
            {snapshots.map(s => (
              <li key={s.id} className="flex items-center justify-between bg-gray-50 border rounded p-2">
                <div>
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm" onClick={() => loadSnapshot(s.id)} aria-label={`Load ${s.name}`}>
                    Load
                  </button>
                  <button className="btn btn-sm" onClick={() => deleteSnapshot(s.id)} aria-label={`Delete ${s.name}`}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
