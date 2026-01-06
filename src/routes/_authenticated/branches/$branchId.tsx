import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BranchDetail } from '@/features/branches/branch-detail'

const branchDetailSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  statusId: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
  // New filter fields
  loanId: z.string().optional(),
  registerNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  loanAmount: z.string().optional(),
  loanAmount_operator: z.string().optional(),
  closePayAmount: z.string().optional(),
  closePayAmount_operator: z.string().optional(),
  payAmount: z.string().optional(),
  payAmount_operator: z.string().optional(),
  payInterest: z.string().optional(),
  payInterest_operator: z.string().optional(),
  overdueDay: z.string().optional(),
  overdueDay_operator: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/branches/$branchId')({
  validateSearch: branchDetailSearchSchema,
  component: BranchDetail,
})
