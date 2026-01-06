import { NotesList } from '@/components/notes-list'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loanService, type JudgeLoan } from '@/services'
import { CustomerTab } from './customer-tab'
import { JudgeTab } from './judge-tab'
import { LoanTab } from './loan-tab'
import { LocationTab } from './location-tab'

type JudgeLoanDetailContentProps = {
  record: JudgeLoan
}

export function JudgeLoanDetailContent({ record }: JudgeLoanDetailContentProps) {
  const { loan } = record

  return (
    <div className='space-y-4 px-1'>
      {/* Header Summary */}
      <div className='bg-muted/30 rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-muted-foreground text-xs'>Зээлийн ID / Шүүхийн код</p>
            <p className='font-mono text-lg font-bold'>
              {loan.loanId} / <span className='text-primary'>{record.code}</span>
            </p>
          </div>
          <Badge variant='secondary' className='text-xs'>
            {record.closeStatus.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue='judge' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 gap-2 h-auto p-1 bg-muted'>
          <TabsTrigger value='judge' className='text-[11px] py-1.5'>Шүүх</TabsTrigger>
          <TabsTrigger value='info' className='text-[11px] py-1.5'>Зээл</TabsTrigger>
          <TabsTrigger value='customer' className='text-[11px] py-1.5'>Харилцагч</TabsTrigger>
          <TabsTrigger value='location' className='text-[11px] py-1.5'>Байршил</TabsTrigger>
          <TabsTrigger value='notes' className='text-[11px] py-1.5'>Зээл тэм/л</TabsTrigger>
          <TabsTrigger value='judge-notes' className='text-[11px] py-1.5'>Шүүх тэм/л</TabsTrigger>
        </TabsList>

        <TabsContent value='judge'>
          <JudgeTab record={record} />
        </TabsContent>

        <TabsContent value='info'>
          <LoanTab loan={loan} />
        </TabsContent>

        <TabsContent value='customer'>
          <CustomerTab customerId={loan.customerId} />
        </TabsContent>

        <TabsContent value='location'>
          <LocationTab customerId={loan.customerId} />
        </TabsContent>

        {/* ЗЭЭЛИЙН ТЭМДЭГЛЭЛ TAB */}
        <TabsContent value='notes' className='mt-4'>
          <NotesList
            id={loan.id}
            customerId={loan.customerId}
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
        </TabsContent>

        {/* ШҮҮХИЙН ТЭМДЭГЛЭЛ TAB */}
        <TabsContent value='judge-notes' className='mt-4'>
          <NotesList
            id={record.id}
            customerId={record.loan.customerId}
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
            scrollAreaHeight='[400px]'
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
