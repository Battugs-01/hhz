import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Customers } from '@/features/user-management/customers'

export const customersSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  query: z.string().optional(),
  district: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type CustomersSearch = z.infer<typeof customersSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/(user-management)/customers/'
)({
  validateSearch: customersSearchSchema,
  component: Customers,
})
