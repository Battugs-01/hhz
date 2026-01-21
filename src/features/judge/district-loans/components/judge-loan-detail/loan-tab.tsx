import { Badge } from '@/components/ui/badge'
import { InfoRow } from '@/components/ui/info-row'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format-utils'
import type { Loan } from '@/services'
import { Banknote } from 'lucide-react'

type LoanTabProps = {
  loan: Loan
}

export function LoanTab({ loan }: LoanTabProps) {
  return (
    <div className='mt-4 space-y-4'>
      <div className='space-y-1'>
        <h4 className='flex items-center gap-2 text-sm font-semibold'>
          <Banknote className='h-4 w-4' />
          Зээлийн дүн
        </h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <InfoRow
            label='Олгосон зээл'
            value={<span className='text-green-600'>{formatCurrency(loan.loanAmount)}</span>}
          />
          <Separator />
          <InfoRow
            label='Сарын хүү'
            value={loan.interestRate ? `${loan.interestRate}%` : '-'}
          />
          <Separator />
          <InfoRow label='Хаах дүн' value={formatCurrency(loan.closePayAmount)} />
          <Separator />
          <InfoRow
            label='Төлөх дүн'
            value={<span className='text-orange-600'>{formatCurrency(loan.payAmount)}</span>}
          />
          <Separator />
          <InfoRow label='Хүү' value={formatCurrency(loan.payInterest)} />
          <Separator />
          <InfoRow
            label='Нэмэгдэл хүү'
            value={<span className='text-red-600'>{formatCurrency(loan.payExtraInterest)}</span>}
          />
        </div>
      </div>

      <div className='space-y-1'>
        <h4 className='text-sm font-semibold'>Нэмэлт мэдээлэл</h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <InfoRow label='Үндсэн төлөв' value={<Badge variant='outline'>{loan.status}</Badge>} />
          <Separator />
          <InfoRow label='Зээлийн төрөл' value={loan.loanType} />
          <Separator />
          <InfoRow label='Хэтэрсэн хоног' value={<Badge variant='destructive'>{loan.overdueDay} хоног</Badge>} />
        </div>
      </div>
    </div>
  )
}
