import { useEffect, useState } from 'react'
import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function HtmlEditor({
  value,
  onChange,
  placeholder = 'Enter HTML content...',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
        placeholder: placeholder,
      },
    },
  })

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className='w-full overflow-hidden rounded-md border'>
      <div className='bg-muted/50 flex border-b'>
        <button
          type='button'
          onClick={() => setMode('write')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'write'
              ? 'bg-background border-primary text-foreground border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Write
        </button>
        <button
          type='button'
          onClick={() => setMode('preview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'preview'
              ? 'bg-background border-primary text-foreground border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Preview
        </button>
      </div>
      {mode === 'write' ? (
        <>
          <div className='bg-muted/30 flex flex-wrap items-center gap-1 border-b p-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('bold') && 'bg-muted'
              )}
            >
              <Bold className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('italic') && 'bg-muted'
              )}
            >
              <Italic className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('underline') && 'bg-muted'
              )}
            >
              <Underline className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('strike') && 'bg-muted'
              )}
            >
              <Strikethrough className='h-4 w-4' />
            </Button>
            <div className='bg-border mx-1 h-6 w-px' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('heading', { level: 1 }) && 'bg-muted'
              )}
            >
              <Heading1 className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('heading', { level: 2 }) && 'bg-muted'
              )}
            >
              <Heading2 className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('heading', { level: 3 }) && 'bg-muted'
              )}
            >
              <Heading3 className='h-4 w-4' />
            </Button>
            <div className='bg-border mx-1 h-6 w-px' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('bulletList') && 'bg-muted'
              )}
            >
              <List className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('orderedList') && 'bg-muted'
              )}
            >
              <ListOrdered className='h-4 w-4' />
            </Button>
            <div className='bg-border mx-1 h-6 w-px' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive({ textAlign: 'left' }) && 'bg-muted'
              )}
            >
              <AlignLeft className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive({ textAlign: 'center' }) && 'bg-muted'
              )}
            >
              <AlignCenter className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive({ textAlign: 'right' }) && 'bg-muted'
              )}
            >
              <AlignRight className='h-4 w-4' />
            </Button>
            <div className='bg-border mx-1 h-6 w-px' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                const url = window.prompt('Enter URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              className={cn(
                'h-8 w-8 p-0',
                editor.isActive('link') && 'bg-muted'
              )}
            >
              <LinkIcon className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => {
                const url = window.prompt('Enter image URL:')
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                }
              }}
              className='h-8 w-8 p-0'
            >
              <ImageIcon className='h-4 w-4' />
            </Button>
            <div className='bg-border mx-1 h-6 w-px' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className='h-8 w-8 p-0'
            >
              <Undo className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className='h-8 w-8 p-0'
            >
              <Redo className='h-4 w-4' />
            </Button>
          </div>
          <div className='min-h-[200px]'>
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        <div className='prose prose-sm dark:prose-invert min-h-[200px] max-w-none overflow-auto p-4'>
          {value ? (
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              className='html-preview'
            />
          ) : (
            <p className='text-muted-foreground text-sm'>
              No content to preview
            </p>
          )}
        </div>
      )}
    </div>
  )
}
