import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CryptoWithdrawal } from '@/features/crypto/withdrawal'

export const cryptoWithdrawalSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  amount: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined
      const num = typeof val === 'string' ? Number(val) : val
      return isNaN(num) ? undefined : num
    }),
  amountCondition: z.string().optional(),
  usdtValuation: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined
      const num = typeof val === 'string' ? Number(val) : val
      return isNaN(num) ? undefined : num
    }),
  usdtValuationCondition: z.string().optional(),
  coin: z.string().optional(),
  network: z.string().optional(),
  txId: z.string().optional(),
  address: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type CryptoWithdrawalSearch = z.infer<
  typeof cryptoWithdrawalSearchSchema
>

export const Route = createFileRoute('/_authenticated/crypto/withdrawal/')({
  validateSearch: cryptoWithdrawalSearchSchema,
  component: CryptoWithdrawal,
})
