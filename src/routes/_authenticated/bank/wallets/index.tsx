import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Wallets as WalletsComponent } from '@/features/bank/wallets'

export const walletSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type WalletSearch = z.infer<typeof walletSearchSchema>

export const Route = createFileRoute('/_authenticated/bank/wallets/')({
  validateSearch: walletSearchSchema,
  component: WalletsComponent,
})
