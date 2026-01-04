import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { ECONOMIST_FILTER_FIELDS, FILTER_KEYS, TABLE_CONFIG } from './constants'

type EconomistsToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function EconomistsToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: EconomistsToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={ECONOMIST_FILTER_FIELDS}
      search={{
        isActive:
          typeof search.isActive === 'string' ? search.isActive : undefined,
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
