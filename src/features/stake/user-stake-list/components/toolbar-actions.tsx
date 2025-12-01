import type { NavigateOptions } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import type { FilterValues } from '@/components/filter-panel'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  FILTER_KEYS,
  TABLE_CONFIG,
  USER_STAKE_LIST_FILTER_FIELDS,
} from './constants'

type UserStakeListToolbarActionsProps = {
  search: FilterValues & {
    start_day?: string
    end_day?: string
    status?: string
    limit?: string | number
  }
  navigate: (opts: NavigateOptions) => void
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
  table?: Table<any>
}

export function UserStakeListToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
  table,
}: UserStakeListToolbarActionsProps) {
  const normalizedLimit =
    typeof search.limit === 'number'
      ? String(search.limit)
      : typeof search.limit === 'string'
        ? search.limit
        : undefined

  return (
    <FilterToolbarActions
      fields={USER_STAKE_LIST_FILTER_FIELDS}
      search={{
        limit: normalizedLimit,
        status: typeof search.status === 'string' ? search.status : undefined,
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
      table={table}
    />
  )
}
