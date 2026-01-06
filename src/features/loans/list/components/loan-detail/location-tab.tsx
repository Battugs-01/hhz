import { InfoRow } from '@/components/ui/info-row'
import { LocationButton } from '@/components/ui/location-button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { customerService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'

type LocationTabProps = {
  customerId: number
}

export function LocationTab({ customerId }: LocationTabProps) {
  // Fetch customer information for locations
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
      </div>
    )
  }

  if (!customer) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>
        Байршлын мэдээлэл олдсонгүй
      </div>
    )
  }

  return (
    <div className='mt-4 space-y-4'>
      <div className='space-y-1'>
        <h4 className='flex items-center gap-2 text-sm font-semibold'>
          <MapPin className='h-4 w-4' />
          Байршлууд
        </h4>
        <div className='bg-muted/30 rounded-lg p-4'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>
                Үндсэн байршил
              </p>
              <LocationButton
                location={customer.location}
                label='Харах'
              />
            </div>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>
                Одоогийн байршил
              </p>
              <LocationButton
                location={customer.currentLocation}
                label='Харах'
              />
            </div>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>
                Ажлын байршил
              </p>
              <LocationButton
                location={customer.workLocation}
                label='Харах'
              />
            </div>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-xs'>
                Нэмэлт байршил
              </p>
              <LocationButton
                location={customer.additionalLocation}
                label='Харах'
              />
            </div>
          </div>
        </div>

        {/* Байршлын координатууд */}
        <div className='bg-muted/30 mt-3 rounded-lg px-4 py-2'>
          {customer.location && (
            <>
              <InfoRow
                label='Үндсэн'
                value={
                  <span className='font-mono text-xs'>
                    {customer.location}
                  </span>
                }
              />
              <Separator />
            </>
          )}
          {customer.currentLocation && (
            <>
              <InfoRow
                label='Одоогийн'
                value={
                  <span className='font-mono text-xs'>
                    {customer.currentLocation}
                  </span>
                }
              />
              <Separator />
            </>
          )}
          {customer.workLocation && (
            <>
              <InfoRow
                label='Ажлын'
                value={
                  <span className='font-mono text-xs'>
                    {customer.workLocation}
                  </span>
                }
              />
              <Separator />
            </>
          )}
          {customer.additionalLocation && (
            <InfoRow
              label='Нэмэлт'
              value={
                <span className='font-mono text-xs'>
                  {customer.additionalLocation}
                </span>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
