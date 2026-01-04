import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LoanStatusPage } from '@/features/loans/loan-status'

export const loanStatusSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type LoanStatusSearch = z.infer<typeof loanStatusSearchSchema>

export const Route = createFileRoute('/_authenticated/loans/status/')({
  validateSearch: loanStatusSearchSchema,
  component: LoanStatusPage,
})
