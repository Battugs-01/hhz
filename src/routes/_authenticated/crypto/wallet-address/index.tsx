import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { WalletAddress as WalletAddressComponent } from '@/features/crypto/wallet-address'

export const walletAddressSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  coin: z.string().optional(),
  network: z.string().optional(),
  address: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type WalletAddressSearch = z.infer<typeof walletAddressSearchSchema>

export const Route = createFileRoute('/_authenticated/crypto/wallet-address/')({
  validateSearch: walletAddressSearchSchema,
  component: WalletAddressComponent,
})
