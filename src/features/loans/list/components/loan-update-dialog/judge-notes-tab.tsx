import { NotesList } from '@/components/notes-list'
import { TabsContent } from '@/components/ui/tabs'
import { loanService } from '@/services'

interface JudgeNotesTabProps {
  judgeLoanId: number
  customerId: number
}

export function JudgeNotesTab({ judgeLoanId, customerId }: JudgeNotesTabProps) {
  return (
    <TabsContent value='judge-notes' className='mt-0 px-6 py-4'>
      <NotesList
        id={judgeLoanId}
        customerId={customerId}
        queryKey='judge-loan-notes'
        title='Шүүхийн тэмдэглэл'
        fetchNotes={async (id) => {
          const res = await loanService.listJudgeLoanNotes({
            judgeLoanId: id,
          })
          return res?.body?.list || []
        }}
        createNote={async (data) => {
          await loanService.createJudgeLoanNote({
            judgeLoanId: data.id,
            customerId: data.customerId,
            note: data.note,
          })
        }}
        showIsNear={false}
        scrollAreaHeight='[300px]'
      />
    </TabsContent>
  )
}
