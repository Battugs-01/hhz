import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Branches } from '@/features/branches'

const branchesSearchSchema = z.object({
  branch: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  isActive: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/branches/')({
  validateSearch: branchesSearchSchema,
  component: Branches,
})
