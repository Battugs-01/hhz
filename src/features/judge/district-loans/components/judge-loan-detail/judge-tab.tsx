import { InfoRow } from '@/components/ui/info-row'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format-utils'
import type { JudgeLoan } from '@/services'
import { Gavel, Phone } from 'lucide-react'

type JudgeTabProps = {
  record: JudgeLoan
}

export function JudgeTab({ record }: JudgeTabProps) {
  return (
    <div className='mt-4 space-y-4'>
      <div className='space-y-1'>
        <h4 className='flex items-center gap-2 text-sm font-semibold text-primary'>
          <Gavel className='h-4 w-4' />
          Шүүхийн мэдээлэл
        </h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2 border border-primary/10'>
          <InfoRow label='Шүүгч' value={record.judge} />
          <Separator />
          <InfoRow label='Шүүгчийн туслах' value={record.judgeAssistant} />
          {record.judgeAssistantPhoneNumber && (
            <>
              <Separator />
              <InfoRow 
                label='Туслахын утас' 
                value={
                  <a href={`tel:${record.judgeAssistantPhoneNumber}`} className='text-blue-600 hover:underline flex items-center gap-1'>
                    <Phone className='h-3 w-3' />
                    {record.judgeAssistantPhoneNumber}
                  </a>
                } 
              />
            </>
          )}
          <Separator />
          <InfoRow label='Дүүрэг' value={record.district.districtMn} />
        </div>
      </div>

      <div className='space-y-1'>
        <h4 className='text-sm font-semibold'>Нэхэмжлэх болон Тогтоол</h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <InfoRow label='Нэхэмжлэлийн №' value={record.invoiceNumber} />
          {record.invoiceDate && (
            <>
              <Separator />
              <InfoRow label='Нэхэмжлэхийн огноо' value={record.invoiceDate} />
            </>
          )}
          {record.invoicedDate && (
            <>
              <Separator />
              <InfoRow label='Шийдвэрлэсэн огноо' value={record.invoicedDate} />
            </>
          )}
          <Separator />
          <InfoRow label='Тогтоол / Шийдвэр' value={record.ordinance || '-'} />
        </div>
      </div>

      <div className='space-y-1'>
        <h4 className='text-sm font-semibold'>Шүүхийн дүн</h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <InfoRow 
            label='Шийдвэрлэсэн дүн' 
            value={<span className='text-blue-600 font-bold'>{formatCurrency(record.ordinanceAmount || 0)}</span>} 
          />
          <Separator />
          <InfoRow label='Тэмдэгтийн хураамж' value={formatCurrency(record.stampFeeAmount || 0)} />
          <Separator />
          <InfoRow 
            label='Буцаан олголт' 
            value={<span className='text-green-600'>{formatCurrency(record.refundStampFeeAmount || 0)}</span>} 
          />
        </div>
      </div>

      {(record.responsibleEmployee || record.requestedActionPage) && (
        <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>Бусад</h4>
            <div className='bg-muted/30 rounded-lg px-4 py-2'>
              <InfoRow label='Хариуцсан ажилтан' value={record.responsibleEmployee || '-'} />
              <Separator />
              <InfoRow label='Хуудасны тоо' value={record.requestedActionPage || '-'} />
            </div>
        </div>
      )}

      {record.description && (
        <div className='space-y-1'>
          <h4 className='text-sm font-semibold'>Шүүхийн тайлбар</h4>
          <div className='bg-muted/30 rounded-lg px-4 py-3'>
            <p className='text-sm'>{record.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
