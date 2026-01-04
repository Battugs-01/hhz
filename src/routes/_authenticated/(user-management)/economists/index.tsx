import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Economists } from '@/features/user-management/economists'

const economistsSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/(user-management)/economists/'
)({
  validateSearch: economistsSearchSchema,
  component: Economists,
})
