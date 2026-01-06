import type {
  District,
  JudgeCloseStatus,
  JudgeLoan,
  Loan,
  LoanStatus,
} from '@/services'

export interface JudgeInfo {
  district: string
  judge: string
  judgeAssistant: string
  judgeAssistantPhoneNumber: string
  invoiceNumber: string
  code: string
  invoiceDate: string
  ordinance: string
  ordinanceAmount: number
  stampFeeAmount: number
  refundStampFeeAmount: number
  closeStatusId: string
  description: string
  responsibleEmployee: string
  invoicedDate: string
  requestedActionPage: string
}

export interface LocationState {
  location: string
  currentLocation: string
  workLocation: string
  additionalLocation: string
}

export interface LoanUpdateDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  data: Loan | null
  judgeLoanId?: number
  judgeLoan?: JudgeLoan
}

export interface InfoTabProps {
  data: Loan
}

export interface LocationTabProps {
  customer: Loan['customer'] | undefined
  location: string
  setLocation: (value: string) => void
  currentLocation: string
  setCurrentLocation: (value: string) => void
  workLocation: string
  setWorkLocation: (value: string) => void
  additionalLocation: string
  setAdditionalLocation: (value: string) => void
}

export interface StatusTabProps {
  data: Loan
  selectedStatus: string
  setSelectedStatus: (value: string) => void
  loanStatuses: LoanStatus[] | undefined
  shouldShowJudgeFields: boolean
  judgeInfo: JudgeInfo
  setJudgeInfo: (value: JudgeInfo) => void
  districtsData: District[] | undefined
  judgeCloseStatuses: JudgeCloseStatus[] | undefined
}
