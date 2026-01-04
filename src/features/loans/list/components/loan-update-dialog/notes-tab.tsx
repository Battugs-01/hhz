import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { LoanNote } from '@/services'
import { loanService } from '@/services'
import { MessageSquare, Plus, Send, User } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface NotesTabProps {
  loanId: number
  customerId: number
}

// Format date helper
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

// Note Item Component
function NoteItem({ note }: { note: LoanNote }) {
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
        {note.isNear && (
          <Badge variant='secondary' className='text-xs'>
            Ойрхон
          </Badge>
        )}
      </div>
      <p className='mt-2 text-sm'>{note.note}</p>
    </div>
  )
}

export function NotesTab({ loanId, customerId }: NotesTabProps) {
  const queryClient = useQueryClient()
  const [note, setNote] = useState('')
  const [isNear, setIsNear] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch notes
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['loan-notes', loanId],
    queryFn: async () => {
      try {
        const res = await loanService.getLoanNotes({
          loanId,
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch loan notes:', error)
        return []
      }
    },
    staleTime: 30000,
    retry: 1,
  })

  const handleSubmit = async () => {
    if (!note.trim()) {
      toast.error('Тэмдэглэл оруулна уу')
      return
    }

    setIsSubmitting(true)
    try {
      await loanService.createLoanNote({
        loanId,
        customerId,
        note: note.trim(),
        isNear,
      })
      toast.success('Тэмдэглэл амжилттай нэмэгдлээ')
      setNote('')
      setIsNear(false)
      // Refresh notes
      queryClient.invalidateQueries({ queryKey: ['loan-notes', loanId] })
    } catch (error) {
      toast.error('Тэмдэглэл нэмэхэд алдаа гарлаа')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <TabsContent value='notes' className='mt-0 px-6 py-4'>
      <div className='space-y-4'>
        <h3 className='flex items-center gap-2 font-semibold'>
          <MessageSquare className='h-4 w-4' />
          Тэмдэглэл
        </h3>

        {/* Add note form */}
        <div className='bg-muted/30 space-y-3 rounded-lg p-4'>
          <div className='space-y-2'>
            <Label className='text-xs'>Шинэ тэмдэглэл</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='Тэмдэглэл оруулах...'
              rows={3}
              className='resize-none'
            />
          </div>
          <div className='flex items-center justify-between'>
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
            <Button
              size='sm'
              onClick={handleSubmit}
              disabled={isSubmitting || !note.trim()}
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

        {/* Notes list */}
        <div className='space-y-2'>
          <Label className='text-muted-foreground text-xs'>
            Өмнөх тэмдэглэлүүд ({notesData?.length || 0})
          </Label>

          {isLoading ? (
            <div className='space-y-3'>
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-20 w-full' />
            </div>
          ) : notesData && notesData.length > 0 ? (
            <ScrollArea className='h-[200px]'>
              <div className='space-y-2 pr-4'>
                {notesData.map((noteItem) => (
                  <NoteItem key={noteItem.id} note={noteItem} />
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
    </TabsContent>
  )
}
