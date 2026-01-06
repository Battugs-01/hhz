import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type OperationLog } from '@/services'

interface LogDetailDialogProps {
  open: boolean
  onClose: () => void
  data: OperationLog
}

export function LogDetailDialog({ open, onClose, data }: LogDetailDialogProps) {
  const formatJSON = (json: any) => {
    try {
      return JSON.stringify(json, null, 2)
    } catch (_e) {
      return String(json)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            Лог дэлгэрэнгүй <span className='text-muted-foreground font-mono text-sm'>#{data.id}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='request' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='request'>Request (Хүсэлт)</TabsTrigger>
            <TabsTrigger value='response'>Response (Хариу)</TabsTrigger>
          </TabsList>

          <TabsContent value='request' className='mt-4'>
            <div className='bg-muted/50 rounded-md p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-semibold uppercase text-muted-foreground'>Request Body</span>
              </div>
              <ScrollArea className='h-[400px] w-full rounded-md border bg-background p-4'>
                <pre className='text-[10px] sm:text-xs font-mono whitespace-pre-wrap break-all'>
                  {formatJSON(data.requestBody)}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value='response' className='mt-4'>
            <div className='bg-muted/50 rounded-md p-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-xs font-semibold uppercase text-muted-foreground'>Response Body</span>
              </div>
              <ScrollArea className='h-[400px] w-full rounded-md border bg-background p-4'>
                <pre className='text-[10px] sm:text-xs font-mono whitespace-pre-wrap break-all'>
                  {formatJSON(data.responseBody)}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
