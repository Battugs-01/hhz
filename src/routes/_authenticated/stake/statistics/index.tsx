import { createFileRoute } from '@tanstack/react-router'
import { StakeStatistics } from '@/features/stake/statistics'

export const Route = createFileRoute('/_authenticated/stake/statistics/')({
  component: StakeStatistics,
})
