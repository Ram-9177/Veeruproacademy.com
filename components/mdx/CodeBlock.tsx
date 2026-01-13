"use client"
import React, { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type Props = { className?: string; children?: ReactNode }

function extractText(node?: ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (React.isValidElement(node)) return extractText(node.props?.children)
  return ''
}

function extractClass(node?: ReactNode): string | undefined {
  if (!React.isValidElement(node)) return undefined
  if (typeof node.props?.className === 'string') return node.props.className
  return extractClass(node.props?.children)
}

// Lightweight client-side syntax highlighting using dynamic import of prismjs (optional)
export const CodeBlock = ({ className = '', children }: Props) => {
  const [ready, setReady] = useState(false)
  const codeText = useMemo(() => extractText(children), [children])
  const languageClass = extractClass(children)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Lazy load prism only in browser
        const Prism = await import('prismjs')
  await import('prismjs/components/prism-python')
  await import('prismjs/components/prism-jsx')
  // @ts-ignore prism supplemental typings not available
  await import('prismjs/components/prism-typescript')
  // @ts-ignore prism supplemental typings not available
  await import('prismjs/components/prism-tsx')
        if (mounted) {
          Prism.highlightAll()
          setReady(true)
        }
      } catch (e) {
        // Silent fail, show plain code
      }
    })()
    return () => { mounted = false }
  }, [])
  const language = languageClass?.replace(/(^language-)|\s.*/g, '') || className.replace(/^language-/, '') || 'bash'
  return (
    <pre className={`rounded-lg border bg-[#0B3B75] text-white text-sm overflow-auto p-4 shadow-soft ${className}`}>
      <code className={ready ? `language-${language}` : ''}>{codeText || children}</code>
    </pre>
  )
}

export default CodeBlock