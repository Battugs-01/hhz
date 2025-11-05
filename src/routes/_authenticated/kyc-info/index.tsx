import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { KycInfo } from '@/features/kyc-info'
import { roles } from '@/features/kyc-info/constants'

const kycInfoSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
  role: z
    .array(z.enum(roles.map((r) => r.value as (typeof roles)[number]['value'])))
    .optional()
    .catch([]),
  // Per-column text filter (example for username)
  username: z.string().optional().catch(''),
  // Date range filter
  start_day: z.string().optional().catch(undefined),
  end_day: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/kyc-info/')({
  validateSearch: kycInfoSearchSchema,
  component: KycInfo,
})
