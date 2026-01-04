import { useQuery } from '@tanstack/react-query'
import type { Loan, LoanNote } from '@/services'
import { customerService, loanService } from '@/services'
import {
  Banknote,
  Briefcase,
  ExternalLink,
  Home,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react'
import {
  formatCurrency,
  formatLoanDate,
  getOverdueStatus,
} from '@/lib/format-utils'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InfoRow } from '@/components/ui/info-row'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Location Button Component
const LocationButton = ({
  location,
  label,
}: {
  location?: string
  label: string
}) => {
  if (!location) return <span className='text-muted-foreground text-xs'>-</span>
  const [lat, lng] = location.split(' ')
  const openInMaps = () =>
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-7 gap-1.5 px-2'
      onClick={openInMaps}
    >
      <MapPin className='h-3 w-3' />
      <span className='text-xs'>{label}</span>
      <ExternalLink className='h-3 w-3' />
    </Button>
  )
}

type LoanDetailContentProps = {
  loan: Loan
}

export function LoanDetailContent({ loan }: LoanDetailContentProps) {
  // Fetch customer information
  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ['customer', loan.customerId],
    queryFn: async () => {
      try {
        const res = await customerService.getCustomer(loan.customerId)
        return res?.data || null
      } catch (error) {
        console.error('Failed to fetch customer:', error)
        return null
      }
    },
    enabled: !!loan.customerId,
    retry: 1,
    staleTime: 60000,
  })

  // Fetch loan notes
  const { data: notes, isLoading: isNotesLoading } = useQuery({
    queryKey: ['loan-notes', loan.id],
    queryFn: async () => {
      try {
        const res = await loanService.getLoanNotes({
          loanId: loan.id,
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch loan notes:', error)
        return []
      }
    },
    retry: 1,
    staleTime: 30000,
  })

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
              ? `${loan.overdueDay} хоног - ${overdueStatus.label}`
              : overdueStatus.label}
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
        <TabsContent value='info' className='mt-4 space-y-4'>
          {/* Зээлийн дүн */}
          <div className='space-y-1'>
            <h4 className='flex items-center gap-2 text-sm font-semibold'>
              <Banknote className='h-4 w-4' />
              Зээлийн дүн
            </h4>
            <div className='bg-muted/30 rounded-lg px-4 py-2'>
              <InfoRow
                label='Олгосон зээл'
                value={
                  <span className='text-green-600'>
                    {formatCurrency(loan.loanAmount)}
                  </span>
                }
              />
              <Separator />
              <InfoRow
                label='Хаах дүн'
                value={formatCurrency(loan.closePayAmount)}
              />
              <Separator />
              <InfoRow
                label='Төлөх дүн'
                value={
                  <span className='text-orange-600'>
                    {formatCurrency(loan.payAmount)}
                  </span>
                }
              />
              <Separator />
              <InfoRow label='Хүү' value={formatCurrency(loan.payInterest)} />
              <Separator />
              <InfoRow
                label='Нэмэгдэл хүү'
                value={
                  <span className='text-red-600'>
                    {formatCurrency(loan.payExtraInterest)}
                  </span>
                }
              />
            </div>
          </div>

          {/* Нэмэлт мэдээлэл */}
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>Нэмэлт мэдээлэл</h4>
            <div className='bg-muted/30 rounded-lg px-4 py-2'>
              <InfoRow
                label='Төлөв'
                value={
                  <Badge variant='outline' className='text-xs'>
                    {loan.status}
                  </Badge>
                }
              />
              <Separator />
              <InfoRow label='Зээлийн төрөл' value={loan.loanType} />
              <Separator />
              <InfoRow
                label='Зээл олгосон огноо'
                value={formatLoanDate(loan.loanDate)}
              />
              <Separator />
              <InfoRow
                label='Эдийн засагч'
                value={loan.economistId ? `#${loan.economistId}` : '-'}
              />
            </div>
          </div>

          {/* Тайлбар */}
          {loan.description && (
            <div className='space-y-1'>
              <h4 className='text-sm font-semibold'>Тайлбар</h4>
              <div className='bg-muted/30 rounded-lg px-4 py-3'>
                <p className='text-sm'>{loan.description}</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ХАРИЛЦАГЧ TAB */}
        <TabsContent value='customer' className='mt-4 space-y-4'>
          {isCustomerLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          ) : customer ? (
            <>
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
            </>
          ) : (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Харилцагчийн мэдээлэл олдсонгүй
            </div>
          )}
        </TabsContent>

        {/* БАЙРШИЛ TAB */}
        <TabsContent value='location' className='mt-4 space-y-4'>
          {isCustomerLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
          ) : customer ? (
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
          ) : (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Байршлын мэдээлэл олдсонгүй
            </div>
          )}
        </TabsContent>

        {/* ТЭМДЭГЛЭЛ TAB */}
        <TabsContent value='notes' className='mt-4 space-y-4'>
          <div className='space-y-1'>
            <h4 className='flex items-center gap-2 text-sm font-semibold'>
              <MessageSquare className='h-4 w-4' />
              Тэмдэглэлүүд ({notes?.length || 0})
            </h4>
            {isNotesLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-16 w-full' />
                <Skeleton className='h-16 w-full' />
              </div>
            ) : notes && notes.length > 0 ? (
              <div className='space-y-2'>
                {notes.map((note: LoanNote) => (
                  <div key={note.id} className='bg-muted/30 rounded-lg p-3'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex items-center gap-2'>
                        <div className='bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full'>
                          <User className='text-primary h-3.5 w-3.5' />
                        </div>
                        <div>
                          <p className='text-xs font-medium'>
                            {note.createdByAdmin?.firstName || '-'}{' '}
                            {note.createdByAdmin?.lastName || '-'}
                          </p>
                          <p className='text-muted-foreground text-[10px]'>
                            {new Date(note.createdAt).toLocaleDateString(
                              'mn-MN',
                              {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      {note.isNear && (
                        <Badge variant='secondary' className='text-[10px]'>
                          Ойрхон
                        </Badge>
                      )}
                    </div>
                    <p className='mt-2 text-sm'>{note.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='bg-muted/30 flex flex-col items-center justify-center rounded-lg py-8'>
                <MessageSquare className='text-muted-foreground h-8 w-8' />
                <p className='text-muted-foreground mt-2 text-sm'>
                  Тэмдэглэл байхгүй байна
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
