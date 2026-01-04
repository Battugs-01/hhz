import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BranchDetail } from '@/features/branches/branch-detail'

const branchDetailSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
  statusId: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/branches/$branchId')({
  validateSearch: branchDetailSearchSchema,
  component: BranchDetail,
})
