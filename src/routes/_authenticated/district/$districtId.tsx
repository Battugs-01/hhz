import { DistrictLoansPage } from '@/features/judge/district-loans'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const districtLoansSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  query: z.string().optional(),
  statusId: z.coerce.string().optional(),
  closeStatusId: z.coerce.string().optional(),
  loanId: z.string().optional(),
  registerNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  judge: z.string().optional(),
  judgeAssistant: z.string().optional(),
  judgeAssistantPhoneNumber: z.string().optional(),
  code: z.string().optional(),
  invoiceNumber: z.string().optional(),
  requestedActionPage: z.string().optional(),
  responsibleEmployee: z.string().optional(),
  loanAmount: z.coerce.string().optional(),
  loanAmount_operator: z.coerce.string().optional(),
  closePayAmount: z.coerce.string().optional(),
  closePayAmount_operator: z.coerce.string().optional(),
  payAmount: z.coerce.string().optional(),
  payAmount_operator: z.coerce.string().optional(),
  payInterest: z.coerce.string().optional(),
  payInterest_operator: z.coerce.string().optional(),
  overdueDay: z.coerce.string().optional(),
  overdueDay_operator: z.coerce.string().optional(),
  ordinanceAmount: z.coerce.string().optional(),
  ordinanceAmount_operator: z.coerce.string().optional(),
  stampFeeAmount: z.coerce.string().optional(),
  stampFeeAmount_operator: z.coerce.string().optional(),
  refundStampFeeAmount: z.coerce.string().optional(),
  refundStampFeeAmount_operator: z.coerce.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/district/$districtId')({
  validateSearch: districtLoansSearchSchema,
  component: DistrictLoansPage,
})
