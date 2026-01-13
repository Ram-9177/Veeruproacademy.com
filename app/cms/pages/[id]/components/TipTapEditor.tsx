'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useState } from 'react'

interface TipTapEditorProps {
  content: string
  onChange: (_content: string) => void
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing your content...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-gray-700 p-2 flex flex-wrap gap-1 sticky top-0 bg-gray-900 z-10">
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
            editor.isActive('bold')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm italic transition-colors ${
            editor.isActive('italic')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1.5 rounded text-sm underline transition-colors ${
            editor.isActive('underline')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          U
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Blockquote & Code */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
            editor.isActive('code')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Code Block
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Link & Image */}
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            editor.isActive('link')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Link
        </button>
        <button
          onClick={() => setShowImageInput(!showImageInput)}
          className="px-3 py-1.5 rounded text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Image
        </button>

        <div className="w-px h-6 bg-gray-700 mx-1" />

        {/* Divider */}
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1.5 rounded text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Divider
        </button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="border-b border-gray-700 p-3 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addLink()
                }
              }}
            />
            <button
              onClick={addLink}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowLinkInput(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="border-b border-gray-700 p-3 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addImage()
                }
              }}
            />
            <button
              onClick={addImage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowImageInput(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="text-white" />
    </div>
  )
}
