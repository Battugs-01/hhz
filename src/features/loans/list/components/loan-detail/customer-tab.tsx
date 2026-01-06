import { Badge } from '@/components/ui/badge'
import { InfoRow } from '@/components/ui/info-row'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { customerService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Home, Phone, User } from 'lucide-react'

type CustomerTabProps = {
  customerId: number
}

export function CustomerTab({ customerId }: CustomerTabProps) {
  // Fetch customer information
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      try {
        const res = await customerService.getCustomer(customerId)
        return res?.data || null
      } catch (error) {
        console.error('Failed to fetch customer:', error)
        return null
      }
    },
    enabled: !!customerId,
    retry: 1,
    staleTime: 60000,
  })

  if (isCustomerLoading) {
    return (
      <div className='mt-4 space-y-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>
        Харилцагчийн мэдээлэл олдсонгүй
      </div>
    )
  }

  return (
    <div className='mt-4 space-y-4'>
      {/* Хувийн мэдээлэл */}
      <div className='space-y-1'>
        <h4 className='flex items-center gap-2 text-sm font-semibold'>
          <User className='h-4 w-4' />
          Хувийн мэдээлэл
        </h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <InfoRow
            label='Овог, Нэр'
            value={
              `${customer.lastName || ''} ${customer.firstName || ''}`.trim() ||
              '-'
            }
          />
          <Separator />
          <InfoRow
            label='Регистр'
            value={
              <span className='font-mono'>
                {customer.registerNumber}
              </span>
            }
          />
          <Separator />
          <InfoRow
            label='Харилцагчийн ID'
            value={
              <span className='font-mono'>{customer.customerId}</span>
            }
          />
          <Separator />
          <InfoRow
            label='Утас'
            value={
              customer.phoneNumber ? (
                <a
                  href={`tel:${customer.phoneNumber}`}
                  className='flex items-center gap-1 text-blue-600 hover:underline'
                >
                  <Phone className='h-3 w-3' />
                  {customer.phoneNumber}
                </a>
              ) : (
                '-'
              )
            }
          />
        </div>
      </div>

      {/* Ажлын мэдээлэл */}
      {(customer.job || customer.jobName) && (
        <div className='space-y-1'>
          <h4 className='flex items-center gap-2 text-sm font-semibold'>
            <Briefcase className='h-4 w-4' />
            Ажлын мэдээлэл
          </h4>
          <div className='bg-muted/30 rounded-lg px-4 py-2'>
            <InfoRow label='Ажил' value={customer.job || '-'} />
            <Separator />
            <InfoRow
              label='Ажлын газар'
              value={customer.jobName || '-'}
            />
          </div>
        </div>
      )}

      {/* Хаяг */}
      <div className='space-y-1'>
        <h4 className='flex items-center gap-2 text-sm font-semibold'>
          <Home className='h-4 w-4' />
          Хаяг
        </h4>
        <div className='bg-muted/30 rounded-lg px-4 py-2'>
          <InfoRow
            label='Гэрийн хаяг'
            value={customer.address || '-'}
          />
          <Separator />
          <InfoRow
            label='Дүүрэг'
            value={
              customer.district ? (
                <Badge variant='secondary' className='text-xs'>
                  {customer.district}
                </Badge>
              ) : (
                '-'
              )
            }
          />
          <Separator />
          <InfoRow label='Хороо' value={customer.khoroo || '-'} />
        </div>
      </div>
    </div>
  )
}
