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
      accessorKey: 'maxSize',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Max Size' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const maxSize = row.getValue('maxSize') as number | undefined
        return (
          <div className='text-sm'>
            {maxSize !== undefined ? maxSize.toLocaleString() : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'usedMaxSize',
      header: ({ column }: { column: Column<StakeAsset> }) => (
        <DataTableColumnHeader column={column} title='Used Max Size' />
      ),
      cell: ({ row }: { row: Row<StakeAsset> }) => {
        const usedMaxSize = row.getValue('usedMaxSize') as number | undefined
        return (
          <div className='text-sm'>
            {usedMaxSize !== undefined ? usedMaxSize.toLocaleString() : '-'}
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
        return (
          <div className='text-sm'>
            {totalStaked !== undefined ? totalStaked.toLocaleString() : '-'}
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
