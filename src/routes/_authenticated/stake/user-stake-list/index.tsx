import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { USERS_STAKE_STATUS } from '@/services'
import { UserStakeList } from '@/features/stake/user-stake-list'

const userStakeListSearchSchema = z.object({
  page: z.number().optional(),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional(),
  limit: z.union([z.string(), z.number()]).optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
  status: z
    .enum([
      USERS_STAKE_STATUS.CANCEL_REQUESTED,
      USERS_STAKE_STATUS.REDEEM_REQUESTED,
      USERS_STAKE_STATUS.ONGOING,
      USERS_STAKE_STATUS.REDEEMED,
      USERS_STAKE_STATUS.CANCELLED,
      USERS_STAKE_STATUS.CANCEL_REQUESTED_MANUAL,
      USERS_STAKE_STATUS.REDEEM_REQUESTED_MANUAL,
    ])
    .optional(),
})

export const Route = createFileRoute('/_authenticated/stake/user-stake-list/')({
  component: UserStakeList,
  validateSearch: userStakeListSearchSchema,
})
