import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { fileService } from '@/services'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Plus, Send, Upload, User, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from './ui/input'

export interface NoteBase {
  id: number
  note: string
  createdAt: string
  createdByAdmin?: {
    firstName?: string
    lastName?: string
  }
  isNear?: boolean
  fileId?: number
  file?: {
    id: number
    fileName: string
    physicalPath: string
    extension: string
  }
}

interface NotesListProps<T extends NoteBase> {
  id: number
  customerId: number
  queryKey: string
  fetchNotes: (id: number) => Promise<T[]>
  createNote: (data: { id: number; customerId: number; note: string; isNear?: boolean; fileId?: number }) => Promise<void>
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

const MINIO_BASE_URL = 'http://103.153.141.50:9000'

function NoteItem({ note, showIsNear }: { note: NoteBase; showIsNear?: boolean }) {
  const isImage = (ext?: string) => {
    if (!ext) return false
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext.toLowerCase())
  }

  const fileUrl = note.file ? `${MINIO_BASE_URL}/${note.file.physicalPath}` : null

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
      
      {note.file && (
        <div className='mt-3'>
          {isImage(note.file.extension) ? (
            <div className='relative group max-w-[200px] overflow-hidden rounded-md border border-input'>
              <img
                src={fileUrl!}
                alt={note.file.fileName}
                className='h-auto w-full cursor-zoom-in transition-transform group-hover:scale-105'
                onClick={() => window.open(fileUrl!, '_blank')}
              />
              <div className='absolute bottom-0 left-0 right-0 bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100'>
                <p className='text-[10px] text-white truncate px-1'>
                  {note.file.fileName}
                </p>
              </div>
            </div>
          ) : (
            <Button
              variant='outline'
              size='sm'
              className='h-8 text-xs gap-2'
              onClick={() => window.open(fileUrl!, '_blank')}
            >
              <Upload className='h-3 w-3' />
              {note.file.fileName}
            </Button>
          )}
        </div>
      )}
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data: notes, isLoading } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => fetchNotes(id),
    staleTime: 30000,
    retry: 1,
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Файлын хэмжээ 10MB-аас бага байх ёстой')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleSubmit = async () => {
    if (!newNote.trim()) {
      toast.error('Тэмдэглэл оруулна уу')
      return
    }

    setIsSubmitting(true)
    try {
      let uploadedFileId: number | undefined

      // Upload file if selected
      if (selectedFile) {
        setIsUploading(true)
        try {
          const uploadResult = await fileService.uploadFile(selectedFile)
          uploadedFileId = uploadResult.data.id
        } catch (error) {
          toast.error('Файл upload хийхэд алдаа гарлаа')
          setIsUploading(false)
          setIsSubmitting(false)
          return
        }
        setIsUploading(false)
      }

      await createNote({
        id,
        customerId,
        note: newNote.trim(),
        isNear,
        fileId: uploadedFileId,
      })
      toast.success('Тэмдэглэл амжилттай нэмэгдлээ')
      setNewNote('')
      setIsNear(false)
      setSelectedFile(null)
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
        
        {/* File upload section */}
        <div className='space-y-2'>
          <div className='flex items-center flex-wrap gap-2'>
            <Input
              id='file-upload'
              type='file'
              onChange={handleFileSelect}
              className='hidden'
              accept='image/*,.pdf,.doc,.docx'
            />
            <Label
              htmlFor='file-upload'
              className='inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-background px-4 text-xs font-medium transition-colors hover:border-primary hover:bg-accent hover:text-accent-foreground'
            >
              <Upload className='h-4 w-4' />
              <span>Файл хавсаргах</span>
            </Label>
            {selectedFile && (
              <div className='flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-sm bg-primary/20 p-1'>
                    <Upload className='h-3 w-3 text-primary' />
                  </div>
                  <span className='text-xs font-medium text-primary'>
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  type='button'
                  onClick={handleRemoveFile}
                  className='rounded-sm p-0.5 text-primary/70 transition-colors hover:bg-primary/20 hover:text-primary'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            )}
          </div>
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
            {isUploading ? (
              'Файл upload хийж байна...'
            ) : isSubmitting ? (
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
