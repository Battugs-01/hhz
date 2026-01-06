import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getOverdueStatus } from '@/lib/format-utils'
import { cn } from '@/lib/utils'
import type { Loan } from '@/services'
import { CustomerTab } from './customer-tab'
import { InfoTab } from './info-tab'
import { LocationTab } from './location-tab'
import { NotesTab } from './notes-tab'

type LoanDetailContentProps = {
  loan: Loan
}

export function LoanDetailContent({ loan }: LoanDetailContentProps) {
  const overdueStatus = getOverdueStatus(loan.overdueDay)

  return (
    <div className='space-y-4'>
      {/* Header Summary */}
      <div className='bg-muted/30 rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-muted-foreground text-xs'>Зээлийн ID</p>
            <p className='font-mono text-lg font-bold'>{loan.loanId}</p>
          </div>
          <Badge
            className={cn(
              'text-xs',
              overdueStatus.variant === 'default' ? 'bg-default' : '',
              overdueStatus.color
            )}
          >
            {loan.overdueDay > 0
              ? `${loan.overdueDay} хоног - ${loan.status}`
              : loan.status}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue='info' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='info' className='text-xs'>
            Мэдээлэл
          </TabsTrigger>
          <TabsTrigger value='customer' className='text-xs'>
            Харилцагч
          </TabsTrigger>
          <TabsTrigger value='location' className='text-xs'>
            Байршил
          </TabsTrigger>
          <TabsTrigger value='notes' className='text-xs'>
            Тэмдэглэл
          </TabsTrigger>
        </TabsList>

        {/* МЭДЭЭЛЭЛ TAB */}
        <TabsContent value='info'>
          <InfoTab loan={loan} />
        </TabsContent>

        {/* ХАРИЛЦАГЧ TAB */}
        <TabsContent value='customer'>
          <CustomerTab customerId={loan.customerId} />
        </TabsContent>

        {/* БАЙРШИЛ TAB */}
        <TabsContent value='location'>
          <LocationTab customerId={loan.customerId} />
        </TabsContent>

        {/* ТЭМДЭГЛЭЛ TAB */}
        <TabsContent value='notes'>
          <NotesTab loanId={loan.id} customerId={loan.customerId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
