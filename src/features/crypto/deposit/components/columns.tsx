import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type CryptoDeposit } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

type CreateColumnsOptions = {
  onIdClick?: (deposit: CryptoDeposit) => void
}

export const createColumns = (
  options?: CreateColumnsOptions
): ColumnDef<CryptoDeposit>[] => {
  const { onIdClick } = options || {}
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
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const id = row.getValue('id') as string
        const deposit = row.original
        return (
          <div
            className='flex items-center gap-1 ps-2'
            onClick={(e) => {
              e.stopPropagation()
              if (onIdClick) {
                onIdClick(deposit)
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
      accessorKey: 'amount',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Amount' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const amount = row.getValue('amount') as number | undefined
        const coin = (row.original as any).coin as
          | { coin?: string; name?: string }
          | undefined
        const coinSymbol = coin?.coin || '-'
        if (amount === undefined || amount === null) return <div>-</div>
        return (
          <div className='ps-2 font-medium'>
            {amount.toLocaleString()} {coinSymbol}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'coin',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Coin' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const coin = (row.original as any).coin as
          | { coin?: string; name?: string }
          | undefined
        const coinSymbol = coin?.coin || '-'
        const coinName = coin?.name
        return (
          <div className='ps-2'>
            <Badge variant='outline' className='capitalize'>
              {coinSymbol}
            </Badge>
            {coinName && (
              <div className='text-muted-foreground mt-1 text-xs'>
                {coinName}
              </div>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'network',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Network' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const network = (row.original as any).network as string | undefined
        return <div className='ps-2'>{network || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'usdtValuation',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='USDT Valuation' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const usdtValuation = (row.original as any).usdtValuation as
          | number
          | undefined
        if (usdtValuation === undefined || usdtValuation === null)
          return <div>-</div>
        return (
          <div className='ps-2'>
            $
            {usdtValuation.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const status = (row.original as any).status as number | undefined
        if (status === undefined || status === null) return <div>-</div>
        const statusText =
          status === 1
            ? 'Completed'
            : status === 0
              ? 'Pending'
              : `Status ${status}`
        return (
          <Badge variant={getStatusVariant(statusText)} className='capitalize'>
            {statusText}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'txId',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Transaction ID' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const txId = (row.original as any).txId as string | undefined
        if (!txId) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(txId)}</span>
            <CopyButton value={txId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'address.address',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Address' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const address = (row.original as any).address as
          | { address?: string }
          | undefined
        const addressValue = address?.address
        if (!addressValue) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(addressValue)}</span>
            <CopyButton value={addressValue} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'sourceAddress',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Source Address' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const sourceAddress = (row.original as any).sourceAddress as
          | string
          | undefined
        if (!sourceAddress) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>
              {maskValue(sourceAddress)}
            </span>
            <CopyButton value={sourceAddress} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'User.email',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='User Email' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const user = (row.original as any).User as
          | { email?: string; subAccountId?: string }
          | undefined
        const email = user?.email
        return <div className='ps-2'>{email || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'insertTime',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Insert Time' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const insertTime = (row.original as any).insertTime as
          | string
          | undefined
        return <div>{formatDate(insertTime)}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'transferTime',
      header: ({ column }: { column: Column<CryptoDeposit> }) => (
        <DataTableColumnHeader column={column} title='Transfer Time' />
      ),
      cell: ({ row }: { row: Row<CryptoDeposit> }) => {
        const transferTime = (row.original as any).transferTime as
          | string
          | undefined
        return <div>{formatDate(transferTime)}</div>
      },
      enableSorting: false,
    },
  ]
}
