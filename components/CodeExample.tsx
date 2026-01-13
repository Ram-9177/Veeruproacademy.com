"use client"
import React, { useState, useEffect } from 'react'
import { ClipboardCopy, Clipboard, Play } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'

type CodeExampleProps = {
  code: string
  language?: 'javascript' | 'html' | 'css'
  runnable?: boolean // if true attempt inline run (only html/js)
  title?: string
}

export function CodeExample({ code, language = 'javascript', runnable = false, title }: CodeExampleProps) {
  const [highlighted, setHighlighted] = useState(code)
  const [output, setOutput] = useState<string>('')

  useEffect(() => {
    try {
      const grammar = Prism.languages[language === 'html' ? 'markup' : language] || Prism.languages.javascript
      const html = Prism.highlight(code, grammar, language)
      setHighlighted(html)
    } catch (e) {
      setHighlighted(code)
    }
  }, [code, language])

  function copy() {
    navigator.clipboard.writeText(code).catch(() => {})
  }
  async function paste() {
    try {
      const txt = await navigator.clipboard.readText()
      if (txt) {
        setHighlighted(Prism.highlight(txt, Prism.languages.javascript, 'javascript'))
      }
    } catch (e) {
      console.debug('paste failed', e)
    }
  }
  function run() {
    if (!runnable) return
    try {
      if (language === 'html') {
        setOutput(code)
      } else if (language === 'javascript') {
        const result = new Function(code)()
        setOutput(String(result ?? ''))
      }
    } catch (e:any) {
      setOutput('Error: ' + e.message)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <span>{title || 'Example'}</span>
          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copy} aria-label="Copy code" className="p-1.5 rounded bg-background border border-border hover:border-primary hover:bg-primary/10 transition"><ClipboardCopy className="h-3.5 w-3.5" /></button>
          <button onClick={paste} aria-label="Paste code" className="p-1.5 rounded bg-background border border-border hover:border-primary hover:bg-primary/10 transition"><Clipboard className="h-3.5 w-3.5" /></button>
          {runnable && <button onClick={run} aria-label="Run code" className="p-1.5 rounded bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition"><Play className="h-3.5 w-3.5" /></button>}
        </div>
      </div>
      <pre className="m-0 p-4 overflow-auto text-xs leading-relaxed font-mono"><code dangerouslySetInnerHTML={{ __html: highlighted }} /></pre>
      {runnable && (
        <div className="border-t border-border bg-muted p-3 text-xs font-mono min-h-[40px]">
          {language === 'html' ? <div dangerouslySetInnerHTML={{ __html: output }} /> : output || <span className="text-muted-foreground">(Run to see output)</span>}
        </div>
      )}
    </div>
  )
}
