import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type Coin } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

type CreateColumnsOptions = {
  onIdClick?: (coin: Coin) => void
}

export const createColumns = (
  options?: CreateColumnsOptions
): ColumnDef<Coin>[] => {
  const { onIdClick } = options || {}
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const id = row.getValue('id') as string
        const coin = row.original
        return (
          <div
            className='flex items-center gap-1 ps-2'
            onClick={(e) => {
              e.stopPropagation()
              if (onIdClick) {
                onIdClick(coin)
              }
            }}
            style={{ cursor: onIdClick ? 'pointer' : 'default' }}
          >
            <span className='hover:text-primary font-mono text-sm text-nowrap underline'>
              {maskValue(id)}
            </span>
            <CopyButton value={id} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'coin',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Symbol' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => (
        <Badge variant='outline' className='uppercase'>
          {row.getValue('coin')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Name' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => (
        <div className='ps-2 font-medium'>{row.getValue('name')}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'image',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Image' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const image = row.getValue('image') as string | undefined
        if (!image) return <div>-</div>
        return (
          <div className='ps-2'>
            <img
              src={image}
              alt={row.original.name}
              className='h-8 w-8 rounded-full object-cover'
            />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isEnabled',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Enabled' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const isEnabled = row.getValue('isEnabled') as number
        return (
          <Badge variant={isEnabled === 1 ? 'success' : 'error'}>
            {isEnabled === 1 ? 'Enabled' : 'Disabled'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isFeatured',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Featured' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const isFeatured = row.getValue('isFeatured') as number
        return (
          <Badge variant={isFeatured === 1 ? 'success' : 'outline'}>
            {isFeatured === 1 ? 'Yes' : 'No'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'trading',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Trading' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const trading = row.getValue('trading') as boolean | undefined
        return (
          <Badge variant={trading ? 'success' : 'error'}>
            {trading ? 'Enabled' : 'Disabled'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'depositAllEnable',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Deposit' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const depositAllEnable = row.getValue('depositAllEnable') as
          | boolean
          | undefined
        return (
          <Badge variant={depositAllEnable ? 'success' : 'error'}>
            {depositAllEnable ? 'Enabled' : 'Disabled'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'withdrawAllEnable',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Withdraw' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const withdrawAllEnable = row.getValue('withdrawAllEnable') as
          | boolean
          | undefined
        return (
          <Badge variant={withdrawAllEnable ? 'success' : 'error'}>
            {withdrawAllEnable ? 'Enabled' : 'Disabled'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'networkList',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Networks' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const networkList = row.getValue('networkList') as
          | Array<{ name?: string; network?: string }>
          | undefined
        if (!networkList || networkList.length === 0) return <div>-</div>
        return (
          <div className='ps-2'>
            <Badge variant='outline'>{networkList.length} network(s)</Badge>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: { column: Column<Coin> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<Coin> }) => {
        const createdAt = row.original.created_at
        return <div>{formatDate(createdAt)}</div>
      },
      enableSorting: false,
    },
  ]
}
