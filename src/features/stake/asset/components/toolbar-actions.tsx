import { useState } from 'react'
import type { NavigateOptions } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FilterValues } from '@/components/filter-panel'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { StakeAssetDialogs } from './dialogs'

type StakeAssetToolbarActionsProps = {
  search: FilterValues & {
    start_day?: string
    end_day?: string
  }
  navigate: (opts: NavigateOptions) => void
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function StakeAssetToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: StakeAssetToolbarActionsProps) {
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
          Create Asset
        </Button>
        <FilterToolbarActions
          fields={[]}
          search={search}
          navigate={navigate}
          filterKeys={[]}
          onDateRangeChange={onDateRangeChange}
          onRefresh={onRefresh}
          tableId='stake-asset-table'
          exportFileName='stake-assets.xlsx'
        />
      </div>

      <StakeAssetDialogs.StakeAssetForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          // queryClient.invalidateQueries in dialogs.tsx handles the refetch
        }}
      />
    </>
  )
}
