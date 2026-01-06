import { NotesList } from '@/components/notes-list'
import { loanService } from '@/services'

type NotesTabProps = {
  loanId: number
  customerId: number
}

export function NotesTab({ loanId, customerId }: NotesTabProps) {
  return (
    <div className='mt-4'>
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
          })
        }}
        showIsNear={true}
        scrollAreaHeight='[400px]'
      />
    </div>
  )
}
