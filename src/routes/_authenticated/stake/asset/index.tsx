import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { StakeAsset } from '@/features/stake/asset'

export const stakeAssetSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional(),
  query: z.string().optional(),
  asset: z.string().optional(),
  status: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type StakeAssetSearch = z.infer<typeof stakeAssetSearchSchema>

export const Route = createFileRoute('/_authenticated/stake/asset/')({
  validateSearch: stakeAssetSearchSchema,
  component: StakeAsset,
})
