import { OperationLogList } from '@/features/operation-logs'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const operationLogsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  query: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/operation-logs')({
  component: OperationLogList,
  validateSearch: (search) => operationLogsSearchSchema.parse(search),
})
