import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Deposit } from '@/features/bank/deposit'

export const depositSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  currency: z.string().optional(),
  txnId: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type DepositSearch = z.infer<typeof depositSearchSchema>

export const Route = createFileRoute('/_authenticated/bank/deposit/')({
  validateSearch: depositSearchSchema,
  component: Deposit,
})
