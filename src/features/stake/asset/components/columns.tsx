import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import type { StakeAsset } from '@/services'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<StakeAsset>[] => {
  return [
    {
      accessorKey: 'asset',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Asset' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const asset = row.getValue('asset') as string
        return (
          <div className='max-w-[200px] truncate font-medium' title={asset}>
            {asset}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'stakeAssetTitle',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const title = row.getValue('stakeAssetTitle') as string | undefined
        return (
          <div className='max-w-[300px] truncate' title={title}>
            {title || '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'totalStakedAmountSize',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Total Staked' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const totalStaked = row.getValue('totalStakedAmountSize') as
          | number
          | undefined
        const maxSize = row.original.maxSize as number | undefined

        if (totalStaked === undefined) {
          return <div className='text-sm'>-</div>
        }

        const percentage =
          maxSize !== undefined && maxSize > 0
            ? Math.min((totalStaked / maxSize) * 100, 100)
            : 0

        return (
          <div className='flex w-full flex-col gap-1.5'>
            <div className='flex items-center justify-between text-xs'>
              <span className='text-muted-foreground'>
                {totalStaked.toLocaleString()}
                {maxSize !== undefined ? ` / ${maxSize.toLocaleString()}` : ''}
              </span>
              <span className='font-medium'>{percentage.toFixed(1)}%</span>
            </div>
            <div className='bg-secondary h-2 w-full overflow-hidden rounded-full'>
              <div
                className='bg-primary h-full transition-all'
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const status = row.getValue('status') as string | undefined
        return (
          <Badge
            variant={status === 'active' ? 'success' : 'secondary'}
            className='capitalize'
          >
            {status || 'N/A'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'image',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Image' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const image = row.getValue('image') as string | undefined
        return image ? (
          <div className='flex items-center gap-2'>
            <img
              src={image}
              alt='Asset'
              className='h-8 w-8 rounded object-cover'
            />
          </div>
        ) : (
          <span className='text-muted-foreground text-sm'>-</span>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createTime',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const createTime = row.getValue('createTime') as number | undefined
        return (
          <div className='text-sm'>
            {createTime ? formatDate(createTime) : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
