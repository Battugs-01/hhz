import { useState } from 'react'
import type { NavigateOptions } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FilterValues } from '@/components/filter-panel'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { StakeContractDialogs } from './dialogs'

type StakeContractToolbarActionsProps = {
  search: FilterValues & {
    start_day?: string
    end_day?: string
  }
  navigate: (opts: NavigateOptions) => void
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function StakeContractToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: StakeContractToolbarActionsProps) {
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
          Create Contract
        </Button>
        <FilterToolbarActions
          fields={[]}
          search={search}
          navigate={navigate}
          filterKeys={[]}
          onDateRangeChange={onDateRangeChange}
          onRefresh={onRefresh}
          tableId='stake-contract-table'
          exportFileName='stake-contracts.xlsx'
        />
      </div>

      <StakeContractDialogs.StakeContractForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          // queryClient.invalidateQueries in dialogs.tsx handles the refetch
        }}
      />
    </>
  )
}
