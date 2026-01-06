import { MapPage } from '@/features/map'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const mapSearchSchema = z.object({
  worker: z.string().optional(),
  branch: z.string().optional(),
  search: z.string().optional(),
  // Advanced filters
  branchId: z.string().optional(),
  economistId: z.string().optional(),
  statusId: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
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

export const Route = createFileRoute('/_authenticated/map/')({
  validateSearch: mapSearchSchema,
  component: MapPage,
})
