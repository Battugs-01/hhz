import { TakeAction } from '@/features/take-action/take-action-list'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'


export const takeActionSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional(),
  actionId: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

export type takeActionSearch = z.infer<typeof takeActionSearchSchema>
export const Route = createFileRoute(
  '/_authenticated/take-action/take-action-list/',
)({
    validateSearch: takeActionSearchSchema,
    component: TakeAction,
})

