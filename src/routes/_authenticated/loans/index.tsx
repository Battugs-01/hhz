import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AllLoansPage } from '@/features/loans/list'

const loansSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  branchId: z.string().optional(),
  statusId: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/loans/')({
  validateSearch: loansSearchSchema,
  component: AllLoansPage,
})
