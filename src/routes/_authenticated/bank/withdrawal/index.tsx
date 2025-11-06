import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Withdrawal } from '@/features/bank/withdrawal'

export const withdrawalSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  totalAmount: z.string().optional(),
  accountNumber: z.string().optional(),
  currency: z.string().optional(),
  txnId: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type WithdrawalSearch = z.infer<typeof withdrawalSearchSchema>

export const Route = createFileRoute('/_authenticated/bank/withdrawal/')({
  validateSearch: withdrawalSearchSchema,
  component: Withdrawal,
})
