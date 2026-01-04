import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  judgeCloseStatusService,
  loanService,
  loanStatusService,
} from '@/services'
import { Banknote } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoTab } from './info-tab'
import { LocationTab } from './location-tab'
import { NotesTab } from './notes-tab'
import { StatusTab } from './status-tab'
import type { JudgeInfo, LoanUpdateDialogProps } from './types'

const initialJudgeInfo: JudgeInfo = {
  district: '',
  judge: '',
  judgeAssistant: '',
  judgeAssistantPhoneNumber: '',
  invoiceNumber: '',
  code: '',
  invoiceDate: '',
  ordinance: '',
  ordinanceAmount: 0,
  stampFeeAmount: 0,
  refundStampFeeAmount: 0,
  closeStatusId: '',
  description: '',
  responsibleEmployee: '',
  invoicedDate: '',
  requestedActionPage: '',
}

export function LoanUpdateDialog({
  open,
  onClose,
  onSuccess,
  data,
}: LoanUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Location states
  const [location, setLocation] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [workLocation, setWorkLocation] = useState('')
  const [additionalLocation, setAdditionalLocation] = useState('')

  // Judge info state
  const [judgeInfo, setJudgeInfo] = useState<JudgeInfo>(initialJudgeInfo)

  // Fetch loan statuses
  const { data: loanStatuses } = useQuery({
    queryKey: ['loan-statuses-for-update'],
    queryFn: async () => {
      try {
        const res = await loanStatusService.listLoanStatuses({ pageSize: 100 })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch loan statuses:', error)
        return []
      }
    },
    enabled: open,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Fetch districts (when selecting status 1 or 4)
  const { data: districtsData } = useQuery({
    queryKey: ['districts-for-update'],
    queryFn: async () => {
      try {
        const res = await loanService.getDistricts()
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch districts:', error)
        return []
      }
    },
    enabled: open && (selectedStatus === '1' || selectedStatus === '4'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Fetch judge close statuses (when selecting status 1 or 4)
  const { data: judgeCloseStatuses } = useQuery({
    queryKey: ['judge-close-statuses-for-update'],
    queryFn: async () => {
      try {
        const res = await judgeCloseStatusService.listJudgeCloseStatuses({
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch judge close statuses:', error)
        return []
      }
    },
    enabled: open && (selectedStatus === '1' || selectedStatus === '4'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Set initial values when dialog opens
  useMemo(() => {
    if (data && open) {
      setSelectedStatus(data.statusId.toString())
      setLocation(data.customer?.location || '')
      setCurrentLocation(data.customer?.currentLocation || '')
      setWorkLocation(data.customer?.workLocation || '')
      setAdditionalLocation(data.customer?.additionalLocation || '')
    }
  }, [data, open])

  // Check if should show judge fields (when selecting status 1 or 4)
  const shouldShowJudgeFields = selectedStatus === '1' || selectedStatus === '4'

  const handleSubmit = async () => {
    if (!data || !selectedStatus) return

    setIsSubmitting(true)
    try {
      // 1. Update customer and loan info via PUT /customer-and-loans/update/{loanId}
      await loanService.updateCustomerAndLoan(data.id, {
        address: data.customer?.address,
        district: data.customer?.district,
        khoroo: data.customer?.khoroo,
        location,
        currentLocation,
        workLocation,
        additionalLocation,
        statusId: Number(selectedStatus),
      })

      // 2. If status is 1 or 4, create judge loan via POST /judge/loan/create
      if (selectedStatus === '1' || selectedStatus === '4') {
        await loanService.createJudgeLoan({
          loanId: data.id,
          districtId: Number(judgeInfo.district),
          judge: judgeInfo.judge,
          judgeAssistant: judgeInfo.judgeAssistant,
          judgeAssistantPhoneNumber: judgeInfo.judgeAssistantPhoneNumber,
          code: judgeInfo.code,
          invoiceNumber: judgeInfo.invoiceNumber,
          invoiceDate: judgeInfo.invoiceDate,
          ordinance: judgeInfo.ordinance,
          ordinanceAmount: judgeInfo.ordinanceAmount,
          stampFeeAmount: judgeInfo.stampFeeAmount,
          refundStampFeeAmount: judgeInfo.refundStampFeeAmount,
          description: judgeInfo.description,
          closeStatusId: Number(judgeInfo.closeStatusId) || 1,
          invoicedDate: judgeInfo.invoicedDate,
          requestedActionPage: judgeInfo.requestedActionPage,
          responsibleEmployee: judgeInfo.responsibleEmployee,
        })
      }

      toast.success('Зээлийн мэдээлэл амжилттай өөрчлөгдлөө')
      onSuccess?.()
      onClose()
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Мэдээлэл өөрчлөхөд алдаа гарлаа'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className='max-w-3xl p-0'>
        <DialogHeader className='border-b px-6 py-4'>
          <DialogTitle className='flex items-center gap-2'>
            <Banknote className='h-5 w-5' />
            Зээлийн мэдээлэл
          </DialogTitle>
          <DialogDescription>
            Зээлийн ID: <span className='font-mono'>{data.loanId}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='mx-6 mt-4 grid w-auto grid-cols-4'>
            <TabsTrigger value='info'>Мэдээлэл</TabsTrigger>
            <TabsTrigger value='location'>Байршил</TabsTrigger>
            <TabsTrigger value='notes'>Тэмдэглэл</TabsTrigger>
            <TabsTrigger value='status'>Төлөв засах</TabsTrigger>
          </TabsList>

          <ScrollArea className='h-[400px]'>
            <InfoTab data={data} />
            <LocationTab
              customer={data.customer}
              location={location}
              setLocation={setLocation}
              currentLocation={currentLocation}
              setCurrentLocation={setCurrentLocation}
              workLocation={workLocation}
              setWorkLocation={setWorkLocation}
              additionalLocation={additionalLocation}
              setAdditionalLocation={setAdditionalLocation}
            />
            <NotesTab loanId={data.id} customerId={data.customerId} />
            <StatusTab
              data={data}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              loanStatuses={loanStatuses}
              shouldShowJudgeFields={shouldShowJudgeFields}
              judgeInfo={judgeInfo}
              setJudgeInfo={setJudgeInfo}
              districtsData={districtsData}
              judgeCloseStatuses={judgeCloseStatuses}
            />
          </ScrollArea>
        </Tabs>

        <DialogFooter className='border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
            Болих
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const LoanDialogs = {
  Update: LoanUpdateDialog,
}
