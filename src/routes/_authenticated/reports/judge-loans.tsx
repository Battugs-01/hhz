import { JudgeLoanReportPage } from '@/features/reports/judge-loan-report'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  current: z.number().default(1).optional(),
  pageSize: z.number().default(20).optional(),
  districtId: z.number().optional(),
  judge: z.string().optional(),
  ordinanceAmount: z.number().optional(),
  ordinanceAmount_operator: z.string().optional(),
  query: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
  // Add other filters as optional strings if needed for advanced filter component reuse
  loanAmount: z.string().optional(),
  loanAmount_operator: z.string().optional(),
  overdueDay: z.string().optional(),
  overdueDay_operator: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/reports/judge-loans')({
  component: JudgeLoanReportPage,
  validateSearch: (search) => searchSchema.parse(search),
})
