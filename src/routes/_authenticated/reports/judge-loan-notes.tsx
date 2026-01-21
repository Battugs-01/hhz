import { JudgeLoanNotesPage } from '@/features/reports/judge-loan-notes'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  current: z.coerce.number().default(1).optional(),
  pageSize: z.coerce.number().default(20).optional(),
  query: z.string().optional(),
  judgeLoanId: z.coerce.number().optional(),
  customerId: z.coerce.number().optional(),
  createdBy: z.coerce.number().optional(),
  phoneNumber: z.string().optional(),
  registerNumber: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/reports/judge-loan-notes')({
  component: JudgeLoanNotesPage,
  validateSearch: (search) => searchSchema.parse(search),
})
