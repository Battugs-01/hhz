import { Banknote, Building2, Phone, User } from 'lucide-react'
import { formatLoanDate, getOverdueStatus } from '@/lib/format-utils'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { InfoRow } from '@/components/ui/info-row'
import { MoneyDisplay } from '@/components/ui/money-display'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import type { InfoTabProps } from './types'

export function InfoTab({ data }: InfoTabProps) {
  const customer = data.customer
  const overdueStatus = getOverdueStatus(data.overdueDay)

  return (
    <TabsContent value='info' className='mt-0 px-6 py-4'>
      <div className='space-y-4'>
        {/* Харилцагчийн мэдээлэл */}
        <h3 className='flex items-center gap-2 font-semibold'>
          <User className='h-4 w-4' />
          Харилцагчийн мэдээлэл
        </h3>

        <div className='bg-muted/30 grid grid-cols-2 gap-x-4 rounded-lg p-4'>
          <InfoRow
            label='Овог, Нэр'
            value={
              customer
                ? `${customer.lastName || ''} ${customer.firstName || ''}`
                : '-'
            }
          />
          <InfoRow
            label='Регистр'
            value={<span className='font-mono'>{data.registerNumber}</span>}
          />
          <InfoRow
            icon={Phone}
            label='Утас'
            value={
              customer?.phoneNumber ? (
                <a
                  href={`tel:${customer.phoneNumber}`}
                  className='text-primary hover:underline'
                >
                  {customer.phoneNumber}
                </a>
              ) : (
                '-'
              )
            }
          />
          <InfoRow
            label='Харилцагчийн ID'
            value={<span className='font-mono'>{customer?.customerId}</span>}
          />
          <InfoRow icon={Building2} label='Ажил' value={customer?.job || '-'} />
          <InfoRow label='Ажлын газар' value={customer?.jobName || '-'} />
        </div>

        <Separator />

        {/* Зээлийн дүн */}
        <h3 className='flex items-center gap-2 text-sm font-semibold'>
          <Banknote className='h-4 w-4' />
          Зээлийн дүн
        </h3>

        <div className='bg-muted/30 grid grid-cols-2 gap-x-6 rounded-lg px-4 py-2'>
          <div>
            <MoneyDisplay
              label='Олгосон зээл'
              amount={data.loanAmount}
              variant='success'
            />
            <MoneyDisplay label='Хаах дүн' amount={data.closePayAmount} />
            <MoneyDisplay
              label='Төлөх дүн'
              amount={data.payAmount}
              variant='warning'
            />
          </div>
          <div>
            <MoneyDisplay label='Хүү' amount={data.payInterest} />
            <MoneyDisplay
              label='Нэмэгдэл хүү'
              amount={data.payExtraInterest}
              variant='danger'
            />
            <div className='flex items-center justify-between py-1.5'>
              <span className='text-muted-foreground text-xs'>Хэтэрсэн</span>
              <span
                className={cn('text-sm font-semibold', overdueStatus.color)}
              >
                {data.overdueDay} хоног
              </span>
            </div>
          </div>
        </div>

        {/* Нэмэлт мэдээлэл */}
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <div className='flex items-center justify-between border-b py-1.5'>
            <span className='text-muted-foreground text-xs'>Төлөв</span>
            <Badge variant={overdueStatus.variant} className='text-xs'>
              {data.status}
            </Badge>
          </div>
          <div className='flex items-center justify-between border-b py-1.5'>
            <span className='text-muted-foreground text-xs'>Зээлийн төрөл</span>
            <span className='text-sm font-medium'>{data.loanType}</span>
          </div>
          <div className='flex items-center justify-between border-b py-1.5'>
            <span className='text-muted-foreground text-xs'>
              Зээл олгосон огноо
            </span>
            <span className='text-sm font-medium'>
              {formatLoanDate(data.loanDate)}
            </span>
          </div>
          <div className='flex items-center justify-between py-1.5'>
            <span className='text-muted-foreground text-xs'>Эдийн засагч</span>
            <span className='text-sm font-medium'>
              {data.economistId ? `#${data.economistId}` : '-'}
            </span>
          </div>
        </div>

        {data.description && (
          <div className='bg-muted/30 rounded-lg px-4 py-2'>
            <p className='text-muted-foreground text-xs'>Тайлбар</p>
            <p className='mt-1 text-sm'>{data.description}</p>
          </div>
        )}
      </div>
    </TabsContent>
  )
}
