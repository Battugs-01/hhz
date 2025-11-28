import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ExchangeTxn } from '@/features/bank/exchange-txn'

export const exchangeTxnSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  reason: z.string().optional(),
  receiverBankCode: z.string().optional(),
  senderBankCode: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type ExchangeTxnSearch = z.infer<typeof exchangeTxnSearchSchema>

export const Route = createFileRoute('/_authenticated/bank/exchange-txn/')({
  validateSearch: exchangeTxnSearchSchema,
  component: ExchangeTxn,
})
