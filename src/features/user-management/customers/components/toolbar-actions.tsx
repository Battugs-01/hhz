import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { CUSTOMER_FILTER_FIELDS, FILTER_KEYS, TABLE_CONFIG } from './constants'

type CustomersToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function CustomersToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: CustomersToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={CUSTOMER_FILTER_FIELDS}
      search={{
        district:
          typeof search.district === 'string' ? search.district : undefined,
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
