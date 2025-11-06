import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { UserInformation } from '@/features/user-management/user-information'

export const userInformationSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  email: z.string().optional(),
  username: z.string().optional(),
  canTrade: z.string().optional(),
  canWithdraw: z.string().optional(),
  kycLevel: z.string().optional(),
  vipLevel: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type UserInformationSearch = z.infer<typeof userInformationSearchSchema>

export const Route = createFileRoute(
  '/_authenticated/(user-management)/user-information/'
)({
  validateSearch: userInformationSearchSchema,
  component: UserInformation,
})
