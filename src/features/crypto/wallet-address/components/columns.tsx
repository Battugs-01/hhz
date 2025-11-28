import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type WalletAddress } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<WalletAddress>[] => {
  return [
    {
      id: 'query',
      accessorKey: 'query',
      header: () => null,
      cell: () => null,
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const id = row.getValue('id') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm text-nowrap'>
              {maskValue(id)}
            </span>
            <CopyButton value={id} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'address',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Address' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const address = row.getValue('address') as string | undefined
        if (!address) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(address)}</span>
            <CopyButton value={address} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'tag',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Tag' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const tag = row.getValue('tag') as string | undefined
        return <div className='ps-2'>{tag || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'coin',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Coin' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const coin = row.getValue('coin') as string | undefined
        return (
          <div className='ps-2'>
            <Badge variant='outline' className='capitalize'>
              {coin || '-'}
            </Badge>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'coinNetwork',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Coin Network' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const coinNetwork = row.getValue('coinNetwork') as string | undefined
        return <div className='ps-2'>{coinNetwork || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'network',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Network' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const network = row.getValue('network') as string | undefined
        return <div className='ps-2'>{network || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isDefault',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Is Default' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const isDefault = row.getValue('isDefault') as boolean | undefined
        return (
          <Badge variant={isDefault ? 'success' : 'outline'}>
            {isDefault ? 'Yes' : 'No'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'url',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='URL' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const url = row.getValue('url') as string | undefined
        if (!url) return <div>-</div>
        return (
          <div className='ps-2'>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary text-sm hover:underline'
            >
              View
            </a>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'User.email',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='User Email' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const email = row.original.User?.email
        return <div className='ps-2'>{email || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: { column: Column<WalletAddress> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<WalletAddress> }) => {
        const createdAt = row.getValue('created_at') as string
        return <div>{formatDate(createdAt)}</div>
      },
      enableSorting: false,
    },
  ]
}
