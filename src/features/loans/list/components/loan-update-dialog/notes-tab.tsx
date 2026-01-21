import { NotesList } from '@/components/notes-list'
import { TabsContent } from '@/components/ui/tabs'
import { loanService } from '@/services'

interface NotesTabProps {
  loanId: number
  customerId: number
}

export function NotesTab({ loanId, customerId }: NotesTabProps) {
  return (
    <TabsContent value='notes' className='mt-0 px-6 py-4'>
      <NotesList
        id={loanId}
        customerId={customerId}
        queryKey='loan-notes'
        title='Зээлийн тэмдэглэл'
        fetchNotes={async (id) => {
          const res = await loanService.getLoanNotes({
            loanId: id,
            pageSize: 100,
          })
          return res?.body?.list || []
        }}
        createNote={async (data) => {
          await loanService.createLoanNote({
            loanId: data.id,
            customerId: data.customerId,
            note: data.note,
            isNear: data.isNear || false,
            fileId: data.fileId,
          })
        }}
        showIsNear={true}
        scrollAreaHeight='[300px]'
      />
    </TabsContent>
  )
}
