import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { judgeCloseStatusService } from '@/services/api/judge-close-status.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  FILTER_KEYS,
  JUDGE_LOAN_FILTER_FIELDS,
  TABLE_CONFIG,
} from './constants'

type JudgeLoanToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function JudgeLoanToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: JudgeLoanToolbarActionsProps) {
  // Fetch judge close statuses for filter options
  const { data: closeStatuses } = useQuery({
    queryKey: ['judge-close-statuses'],
    queryFn: async () => {
      try {
        const res = await judgeCloseStatusService.listJudgeCloseStatuses({
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (_error) {
        return []
      }
    },
    staleTime: 300000,
    retry: 1,
  })

  // Build filter fields with dynamic options
  const filterFields = useMemo(() => {
    return JUDGE_LOAN_FILTER_FIELDS.map((field) => {
      if (field.key === 'closeStatusId' && closeStatuses) {
        return {
          ...field,
          options: closeStatuses.map((status) => ({
            label: status.status,
            value: String(status.id),
          })),
        }
      }
      return field
    })
  }, [closeStatuses])

  return (
    <FilterToolbarActions
      fields={filterFields}
      search={{
        ...Object.fromEntries(
          FILTER_KEYS.map(key => [
            key, 
            typeof search[key] === 'string' || typeof search[key] === 'number'
              ? String(search[key])
              : undefined
          ])
        ),
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={TABLE_CONFIG.ID}
      exportFileName='judge-loans.xlsx'
    />
  )
}
