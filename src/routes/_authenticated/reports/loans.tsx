import { LoanReportPage } from '@/features/reports/loan-report'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  current: z.number().default(1).optional(),
  pageSize: z.number().default(20).optional(),
  branchId: z.number().optional(),
  loanAmount: z.string().optional(),
  loanAmount_operator: z.string().optional(),
  overdueDay: z.string().optional(),
  overdueDay_operator: z.string().optional(),
  query: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/reports/loans')({
  component: LoanReportPage,
  validateSearch: (search) => searchSchema.parse(search),
})
