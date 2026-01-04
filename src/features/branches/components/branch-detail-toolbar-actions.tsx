import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { LoanStatus } from '@/services'
import { loanStatusService } from '@/services'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { FilterField } from '@/components/filter-panel'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { LOAN_TABLE_CONFIG } from './constants'

const FILTER_KEYS = ['statusId'] as const

const BRANCH_LOAN_FILTER_FIELDS: FilterField[] = [
  {
    key: 'statusId',
    label: 'Төлөв',
    type: 'select',
    placeholder: 'Төлөв сонгох...',
    options: [],
  },
  {
    key: 'dateRange',
    label: 'Огнооны хүрээ',
    type: 'date-range',
    placeholder: 'Огноогоор шүүх',
  },
]

type BranchDetailToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function BranchDetailToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: BranchDetailToolbarActionsProps) {
  // Fetch loan statuses for filter options
  const { data: loanStatuses } = useQuery({
    queryKey: ['loan-statuses'],
    queryFn: async () => {
      try {
        const res = await loanStatusService.listLoanStatuses({
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch loan statuses:', error)
        return []
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 1,
  })

  // Build filter fields with dynamic options
  const filterFields = useMemo(() => {
    return BRANCH_LOAN_FILTER_FIELDS.map((field) => {
      if (field.key === 'statusId' && loanStatuses) {
        return {
          ...field,
          options: loanStatuses.map((status: LoanStatus) => ({
            label: status.description,
            value: String(status.id),
          })),
        }
      }
      return field
    })
  }, [loanStatuses])

  return (
    <FilterToolbarActions
      fields={filterFields}
      search={{
        statusId:
          typeof search.statusId === 'string' ? search.statusId : undefined,
        start_day:
          typeof search.start_day === 'string' ? search.start_day : undefined,
        end_day:
          typeof search.end_day === 'string' ? search.end_day : undefined,
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={LOAN_TABLE_CONFIG.ID}
      exportFileName={LOAN_TABLE_CONFIG.EXPORT_FILE_NAME}
    />
  )
}
