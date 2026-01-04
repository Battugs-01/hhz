import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { JudgeCloseStatusPage } from '@/features/judge/judge-close-status'

const judgeCloseStatusSearchSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  query: z.string().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/(judge)/judge-close-status/'
)({
  validateSearch: judgeCloseStatusSearchSchema,
  component: JudgeCloseStatusPage,
})
