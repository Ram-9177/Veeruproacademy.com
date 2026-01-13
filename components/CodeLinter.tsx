'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LintError {
  line: number
  column?: number
  message: string
  severity: 'error' | 'warning' | 'info'
}

interface CodeLinterProps {
  errors: LintError[]
  className?: string
}

export function CodeLinter({ errors, className }: CodeLinterProps) {
  if (errors.length === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-emerald-600', className)}>
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        <span>No errors found</span>
      </div>
    )
  }

  const errorCount = errors.filter(e => e.severity === 'error').length
  const warningCount = errors.filter(e => e.severity === 'warning').length

  return (
    <div className={cn('space-y-2', className)} role="alert" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-medium">
        <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
        <span className="text-neutral-700">
          {errorCount > 0 && `${errorCount} error${errorCount !== 1 ? 's' : ''}`}
          {errorCount > 0 && warningCount > 0 && ', '}
          {warningCount > 0 && `${warningCount} warning${warningCount !== 1 ? 's' : ''}`}
        </span>
      </div>
      
      <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
        {errors.map((error, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-start gap-2 p-2 rounded border',
              error.severity === 'error' 
                ? 'bg-red-50 border-red-200 text-red-700'
                : error.severity === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            )}
          >
            <span className="font-mono font-semibold">
              {error.line}:{error.column || 0}
            </span>
            <span>{error.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple HTML/CSS/JS linter
export function lintCode(code: string, type: 'html' | 'css' | 'js'): LintError[] {
  const errors: LintError[] = []
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    const lineNum = index + 1

    if (type === 'html') {
      // Check for unclosed tags (simple check)
      const openTags = (line.match(/<[^/][^>]*>/g) || []).length
      const closeTags = (line.match(/<\/[^>]+>/g) || []).length
      if (openTags > closeTags + 1) {
        errors.push({
          line: lineNum,
          message: 'Possible unclosed tag',
          severity: 'warning',
        })
      }
    } else if (type === 'css') {
      // Check for unclosed braces
      const openBraces = (line.match(/{/g) || []).length
      const closeBraces = (line.match(/}/g) || []).length
      if (openBraces !== closeBraces && line.trim()) {
        errors.push({
          line: lineNum,
          message: 'Unmatched braces',
          severity: 'warning',
        })
      }
    } else if (type === 'js') {
      // Check for common JS errors
      if (line.includes('console.log') && !line.includes('//')) {
        // Just a warning, not an error
      }
      // Check for unclosed brackets/braces
      const openBraces = (line.match(/{/g) || []).length
      const closeBraces = (line.match(/}/g) || []).length
      const openBrackets = (line.match(/\[/g) || []).length
      const closeBrackets = (line.match(/\]/g) || []).length
      if ((openBraces !== closeBraces || openBrackets !== closeBrackets) && line.trim()) {
        errors.push({
          line: lineNum,
          message: 'Unmatched brackets or braces',
          severity: 'warning',
        })
      }
    }
  })

  return errors
}

