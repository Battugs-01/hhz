import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Admins } from '@/features/user-management/admins'

export const adminsSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  role: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type AdminsSearch = z.infer<typeof adminsSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/(user-management)/admins/'
)({
  validateSearch: adminsSearchSchema,
  component: Admins,
})
