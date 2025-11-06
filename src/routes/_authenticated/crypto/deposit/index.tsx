import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CryptoDeposit as CryptoDepositComponent } from '@/features/crypto/deposit'

export const cryptoDepositSearchSchema = z.object({
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

export type CryptoDepositSearch = z.infer<typeof cryptoDepositSearchSchema>

export const Route = createFileRoute('/_authenticated/crypto/deposit/')({
  validateSearch: cryptoDepositSearchSchema,
  component: CryptoDepositComponent,
})
