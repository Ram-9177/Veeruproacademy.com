'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Keyboard } from 'lucide-react'
import { Button } from '@/app/components/Button'

const shortcuts = [
  { keys: ['Ctrl', 'Enter'], description: 'Run code / Update preview' },
  { keys: ['Ctrl', 'S'], description: 'Save code' },
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['Tab'], description: 'Navigate to next editor' },
  { keys: ['Shift', 'Tab'], description: 'Navigate to previous editor' },
  { keys: ['Ctrl', '/'], description: 'Toggle comment' },
  { keys: ['Ctrl', 'F'], description: 'Find in code' },
  { keys: ['Ctrl', 'Shift', 'P'], description: 'Format code' },
  { keys: ['Esc'], description: 'Close dialogs / Cancel' },
]

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-popover text-popover-foreground rounded-2xl shadow-2xl max-w-lg w-full mx-4 z-50 max-h-[80vh] overflow-y-auto border border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Keyboard className="h-6 w-6" />
                  Keyboard Shortcuts
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <span key={keyIdx}>
                          <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm">
                            {key}
                          </kbd>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground mx-1">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <p className="text-sm text-emerald-300">
                  <strong>Tip:</strong> On Mac, use <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">⌘</kbd> instead of <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded">Ctrl</kbd>
                </p>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

