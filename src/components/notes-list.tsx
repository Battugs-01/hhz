import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Plus, Send, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export interface NoteBase {
  id: number
  note: string
  createdAt: string
  createdByAdmin?: {
    firstName?: string
    lastName?: string
  }
  isNear?: boolean
}

interface NotesListProps<T extends NoteBase> {
  id: number
  customerId: number
  queryKey: string
  fetchNotes: (id: number) => Promise<T[]>
  createNote: (data: { id: number; customerId: number; note: string; isNear?: boolean }) => Promise<void>
  title?: string
  showIsNear?: boolean
  className?: string
  scrollAreaHeight?: string
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function NoteItem({ note, showIsNear }: { note: NoteBase; showIsNear?: boolean }) {
  return (
    <div className='bg-muted/30 rounded-lg p-3'>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
            <User className='text-primary h-4 w-4' />
          </div>
          <div>
            <p className='text-sm font-medium'>
              {note.createdByAdmin?.firstName || '-'}{' '}
              {note.createdByAdmin?.lastName || '-'}
            </p>
            <p className='text-muted-foreground text-xs'>
              {formatDate(note.createdAt)}
            </p>
          </div>
        </div>
        {showIsNear && note.isNear && (
          <Badge variant='secondary' className='text-xs'>
            Ойрхон
          </Badge>
        )}
      </div>
      <p className='mt-2 text-sm whitespace-pre-wrap'>{note.note}</p>
    </div>
  )
}

export function NotesList<T extends NoteBase>({
  id,
  customerId,
  queryKey,
  fetchNotes,
  createNote,
  title = 'Тэмдэглэл',
  showIsNear = false,
  className,
  scrollAreaHeight = '[200px]',
}: NotesListProps<T>) {
  const queryClient = useQueryClient()
  const [newNote, setNewNote] = useState('')
  const [isNear, setIsNear] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: notes, isLoading } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => fetchNotes(id),
    staleTime: 30000,
    retry: 1,
  })

  const handleSubmit = async () => {
    if (!newNote.trim()) {
      toast.error('Тэмдэглэл оруулна уу')
      return
    }

    setIsSubmitting(true)
    try {
      await createNote({
        id,
        customerId,
        note: newNote.trim(),
        isNear,
      })
      toast.success('Тэмдэглэл амжилттай нэмэгдлээ')
      setNewNote('')
      setIsNear(false)
      queryClient.invalidateQueries({ queryKey: [queryKey, id] })
    } catch (_error) {
      toast.error('Тэмдэглэл нэмэхэд алдаа гарлаа')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className='flex items-center gap-2 font-semibold'>
        <MessageSquare className='h-4 w-4' />
        {title}
      </h3>

      <div className='bg-muted/30 space-y-3 rounded-lg p-4'>
        <div className='space-y-2'>
          <Label className='text-xs'>Шинэ тэмдэглэл</Label>
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder='Тэмдэглэл оруулах...'
            rows={3}
            className='resize-none'
          />
        </div>
        <div className='flex items-center justify-between'>
          {showIsNear ? (
            <div className='flex items-center gap-2'>
              <Checkbox
                id='isNear'
                checked={isNear}
                onCheckedChange={(checked) => setIsNear(checked === true)}
              />
              <Label htmlFor='isNear' className='cursor-pointer text-xs'>
                Ойрхон байна
              </Label>
            </div>
          ) : (
            <div />
          )}
          <Button
            size='sm'
            onClick={handleSubmit}
            disabled={isSubmitting || !newNote.trim()}
          >
            {isSubmitting ? (
              'Нэмж байна...'
            ) : (
              <>
                <Send className='mr-1 h-3 w-3' />
                Нэмэх
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      <div className='space-y-2'>
        <Label className='text-muted-foreground text-xs'>
          Өмнөх тэмдэглэлүүд ({notes?.length || 0})
        </Label>

        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-20 w-full' />
          </div>
        ) : notes && notes.length > 0 ? (
          <ScrollArea className={`h-${scrollAreaHeight}`}>
            <div className='space-y-2 pr-4'>
              {[...notes].reverse().map((noteItem) => (
                <NoteItem key={noteItem.id} note={noteItem} showIsNear={showIsNear} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg py-8'>
            <Plus className='text-muted-foreground h-8 w-8' />
            <p className='text-muted-foreground mt-2 text-sm'>
              Тэмдэглэл байхгүй байна
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
