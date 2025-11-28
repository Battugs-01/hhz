import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { StakeContract } from '@/features/stake/contract'

export const stakeContractSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional(),
  query: z.string().optional(),
  stakeContractName: z.string().optional(),
  asset: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type StakeContractSearch = z.infer<typeof stakeContractSearchSchema>

export const Route = createFileRoute('/_authenticated/stake/contract/')({
  validateSearch: stakeContractSearchSchema,
  component: StakeContract,
})
