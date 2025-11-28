import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Coins as CoinsComponent } from '@/features/crypto/coins'

export const coinsSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  id: z.string().optional(),
  symbol: z.string().optional(),
  trading: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined
      if (typeof val === 'boolean') return val ? 'true' : 'false'
      if (val === 'true' || val === 'false') return val
      return undefined
    }),
  deposit: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined
      if (typeof val === 'boolean') return val ? 'true' : 'false'
      if (val === 'true' || val === 'false') return val
      return undefined
    }),
  withdrawals: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined
      if (typeof val === 'boolean') return val ? 'true' : 'false'
      if (val === 'true' || val === 'false') return val
      return undefined
    }),
})

export type CoinsSearch = z.infer<typeof coinsSearchSchema>

export const Route = createFileRoute('/_authenticated/crypto/coins/')({
  validateSearch: coinsSearchSchema,
  component: CoinsComponent,
})
