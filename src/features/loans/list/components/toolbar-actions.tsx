import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { branchService, LoanStatus, loanStatusService } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { FILTER_KEYS, LOAN_FILTER_FIELDS, TABLE_CONFIG } from './constants'

type LoanToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function LoanToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: LoanToolbarActionsProps) {
  // Fetch branches for filter options
  const { data: branches } = useQuery({
    queryKey: ['branches-for-filter'],
    queryFn: async () => {
      try {
        const res = await branchService.listBranches({
          current: 1,
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch branches:', error)
        return []
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 1,
  })

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
    return LOAN_FILTER_FIELDS.map((field) => {

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
  }, [branches, loanStatuses])

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
        start_day:
          typeof search.start_day === 'string' ? search.start_day : undefined,
        end_day:
          typeof search.end_day === 'string' ? search.end_day : undefined,
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={TABLE_CONFIG.ID}
      exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
    />
  )

}
