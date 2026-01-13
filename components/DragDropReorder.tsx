"use client"

import { useState, type ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DragDropReorderProps<T extends { id: string; order?: number }> {
  items: T[]
  onReorder: (_items: T[]) => void
  renderItem: (_item: T, _index: number) => ReactNode
  className?: string
}

export function DragDropReorder<T extends { id: string; order?: number }>({
  items,
  onReorder,
  renderItem,
  className
}: DragDropReorderProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    // Update order values
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }))

    onReorder(reorderedItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={cn(
            'flex items-center gap-3 p-4 rounded-lg border transition-all cursor-move',
            draggedIndex === index
              ? 'opacity-50 border-emerald-500 bg-emerald-50'
              : dragOverIndex === index
              ? 'border-emerald-500 bg-emerald-50 scale-105'
              : 'border-neutral-200 hover:border-neutral-300'
          )}
        >
          <div className="text-neutral-400 hover:text-neutral-600 flex-shrink-0">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex-1">
            {renderItem(item, index)}
          </div>
        </div>
      ))}
    </div>
  )
}

