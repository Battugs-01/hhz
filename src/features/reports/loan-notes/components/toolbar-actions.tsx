import type { FilterField } from '@/components/filter-panel'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import type { NavigateFn } from '@/hooks/use-table-url-state'

type NoteToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
  fields: FilterField[]
  filterKeys: readonly string[]
  tableId: string
  exportFileName: string
}

export function NoteToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
  fields,
  filterKeys,
  tableId,
  exportFileName,
}: NoteToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={fields}
      search={search as any}
      navigate={navigate}
      filterKeys={filterKeys}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={tableId}
      exportFileName={exportFileName}
    />
  )
}
