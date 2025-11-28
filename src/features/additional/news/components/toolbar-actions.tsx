import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { FILTER_KEYS, NEWS_FILTER_FIELDS, TABLE_CONFIG } from './constants'
import { NewsDialogs } from './dialogs'

type NewsToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function NewsToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: NewsToolbarActionsProps) {
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
          Create News
        </Button>
        <FilterToolbarActions
          fields={NEWS_FILTER_FIELDS}
          search={{
            category:
              typeof search.category === 'string' ? search.category : undefined,
            status:
              typeof search.status === 'string' ? search.status : undefined,
            start_day:
              typeof search.start_day === 'string'
                ? search.start_day
                : undefined,
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
      </div>

      <NewsDialogs.NewsForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          // queryClient.invalidateQueries in dialogs.tsx handles the refetch
        }}
      />
    </>
  )
}
