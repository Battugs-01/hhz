import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Textarea } from '@/components/ui/textarea'

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [mode, setMode] = useState<'write' | 'preview'>('write')

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
      <div className='min-h-[200px]'>
        {mode === 'write' ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder='Enter markdown content...'
            className='min-h-[200px] resize-none border-0 focus-visible:ring-0'
          />
        ) : (
          <div className='prose prose-sm dark:prose-invert [&_table]:border-border [&_th]:border-border [&_th]:bg-muted [&_td]:border-border max-w-none overflow-auto p-4 [&_table]:border-collapse [&_table]:border [&_td]:border [&_td]:p-2 [&_th]:p-2 [&_th]:font-semibold'>
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className='text-muted-foreground text-sm'>
                No content to preview
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
