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
import {
  judgeCloseStatusService,
  loanService,
  loanStatusService,
} from '@/services'
import { useQuery } from '@tanstack/react-query'
import { Banknote } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { InfoTab } from './info-tab'
import { JudgeNotesTab } from './judge-notes-tab'
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
  judgeLoanId,
  judgeLoan,
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

  // Fetch existing judge loan details if updating
  useQuery({
    queryKey: ['judge-loan-detail', judgeLoanId],
    queryFn: async () => {
      if (!judgeLoanId) return null
      // If we already have the data passed as prop, return it immediately
      if (judgeLoan && judgeLoan.id === judgeLoanId) {
        return null; 
      }
      
      try {
        const res = await loanService.getJudgeLoan(judgeLoanId)
        if (res.success && res.body) {
          const jl = res.body
          setJudgeInfo({
            district: jl.districtId.toString(),
            judge: jl.judge,
            judgeAssistant: jl.judgeAssistant,
            judgeAssistantPhoneNumber: jl.judgeAssistantPhoneNumber || '',
            code: jl.code,
            invoiceNumber: jl.invoiceNumber,
            invoiceDate: jl.invoiceDate || '',
            ordinance: jl.ordinance || '',
            ordinanceAmount: jl.ordinanceAmount || 0,
            stampFeeAmount: jl.stampFeeAmount || 0,
            refundStampFeeAmount: jl.refundStampFeeAmount || 0,
            closeStatusId: jl.closeStatusId.toString(),
            description: jl.description || '',
            responsibleEmployee: jl.responsibleEmployee || '',
            invoicedDate: jl.invoicedDate || '',
            requestedActionPage: jl.requestedActionPage || '',
          })
          return jl
        }
        return null
      } catch (error) {
        console.error('Failed to fetch judge loan details:', error)
        return null
      }
    },
    enabled: !!judgeLoanId && open && !judgeLoan, // Disable query if judgeLoan prop is provided
  })

  // Set initial values when dialog opens (including judge info from prop)
  useMemo(() => {
    if (open) {
      if (data) {
        setSelectedStatus(data.statusId.toString())
        setLocation(data.customer?.location || '')
        setCurrentLocation(data.customer?.currentLocation || '')
        setWorkLocation(data.customer?.workLocation || '')
        setAdditionalLocation(data.customer?.additionalLocation || '')
      }
      
      // Initialize judge info from prop if available
      if (judgeLoan) {
        setJudgeInfo({
          district: judgeLoan.districtId.toString(),
          judge: judgeLoan.judge,
          judgeAssistant: judgeLoan.judgeAssistant,
          judgeAssistantPhoneNumber: judgeLoan.judgeAssistantPhoneNumber || '',
          code: judgeLoan.code,
          invoiceNumber: judgeLoan.invoiceNumber,
          invoiceDate: judgeLoan.invoiceDate || '',
          ordinance: judgeLoan.ordinance || '',
          ordinanceAmount: judgeLoan.ordinanceAmount || 0,
          stampFeeAmount: judgeLoan.stampFeeAmount || 0,
          refundStampFeeAmount: judgeLoan.refundStampFeeAmount || 0,
          closeStatusId: judgeLoan.closeStatusId.toString(),
          description: judgeLoan.description || '',
          responsibleEmployee: judgeLoan.responsibleEmployee || '',
          invoicedDate: judgeLoan.invoicedDate || '',
          requestedActionPage: judgeLoan.requestedActionPage || '',
        })
      }
    }
  }, [data, judgeLoan, open])

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

      const isJudgeStatus = selectedStatus === '1' || selectedStatus === '4'
      const statusChanged = selectedStatus !== data.statusId.toString()

      if (isJudgeStatus) {
        if (judgeLoanId) {
          // Update existing judge loan
          await loanService.updateJudgeLoan({
            id: judgeLoanId,
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
        } else if (statusChanged) {
          // Create new judge loan only if status changed to judge status
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
      <DialogContent className='sm:max-w-6xl p-0'>
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
          <TabsList className='mx-6 mt-4 flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0'>
            <TabsTrigger
              value='info'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border'
            >
              Мэдээлэл
            </TabsTrigger>
            <TabsTrigger
              value='location'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border'
            >
              Байршил
            </TabsTrigger>
            <TabsTrigger
              value='notes'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border'
            >
              Тэмдэглэл
            </TabsTrigger>
            {judgeLoanId && (
              <TabsTrigger
                value='judge-notes'
                className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border'
              >
                Шүүхийн тэмдэглэл
              </TabsTrigger>
            )}
            <TabsTrigger
              value='status'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border'
            >
              Төлөв засах
            </TabsTrigger>
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
            {judgeLoanId && (
              <JudgeNotesTab
                judgeLoanId={judgeLoanId}
                customerId={data.customerId}
              />
            )}
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
