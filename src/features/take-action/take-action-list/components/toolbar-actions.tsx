import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { FILTER_KEYS, TAKE_ACTION_FILTER_FIELDS, TABLE_CONFIG } from './constants'
import { TakeActionDialogs } from './dialogs'

type TakeActionToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function TakeActionToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: TakeActionToolbarActionsProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  return (
    <>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          onClick={() => setCreateDialogOpen(true)}
          size='sm'
          className='gap-2'
        >
          <Plus className='h-4 w-4' />
          Create Take Action
        </Button>
        <FilterToolbarActions
          fields={TAKE_ACTION_FILTER_FIELDS}
          search={{
            category:
              typeof search.category === 'string' ? search.category : undefined,
            status:
              typeof search.status === 'string' ? search.status : undefined,
          }}
          navigate={navigate}
          filterKeys={FILTER_KEYS}
          onDateRangeChange={onDateRangeChange}
          onRefresh={onRefresh}
          tableId={TABLE_CONFIG.ID}
          exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
        />
      </div>

      <TakeActionDialogs.TakeActionForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          // queryClient.invalidateQueries in dialogs.tsx handles the refetch
        }}
      />
    </>
  )
}
