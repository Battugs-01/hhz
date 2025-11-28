import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type CryptoWithdrawal } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

type CreateColumnsOptions = {
  onIdClick?: (withdrawal: CryptoWithdrawal) => void
}

export const createColumns = (
  options?: CreateColumnsOptions
): ColumnDef<CryptoWithdrawal>[] => {
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
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Withdrawal ID' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const id = row.getValue('id') as string
        const withdrawal = row.original
        return (
          <div
            className='flex items-center gap-1 ps-2'
            onClick={(e) => {
              e.stopPropagation()
              if (onIdClick) {
                onIdClick(withdrawal)
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
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Amount' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const amount = row.getValue('amount') as number | undefined
        const coin = row.original.coin
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
      accessorKey: 'BWFee',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='BW Fee' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const bwFee = row.original.BWFee
        if (bwFee === undefined || bwFee === null) return <div>-</div>
        return (
          <div className='ps-2'>
            {bwFee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'SWFee',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='SW Fee' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const swFee = row.original.SWFee
        if (swFee === undefined || swFee === null) return <div>-</div>
        return (
          <div className='ps-2'>
            {swFee.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'coin',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Coin' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const coin = row.original.coin
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
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Network' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const network = row.original.network
        return <div className='ps-2'>{network || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'usdtValuation',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='USDT Valuation' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const usdtValuation = row.original.usdtValuation
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
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const status = row.original.status
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
      accessorKey: 'txnId',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Transaction ID' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const txnId = row.original.txnId
        if (!txnId) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(txnId)}</span>
            <CopyButton value={txnId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'address',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Address' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const address = row.original.address
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
      accessorKey: 'User.email',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='User Email' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const email = row.original.User?.email
        return <div className='ps-2'>{email || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'insertTime',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Insert Time' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const insertTime = row.original.insertTime
        return <div>{formatDate(insertTime)}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'transferTime',
      header: ({ column }: { column: Column<CryptoWithdrawal> }) => (
        <DataTableColumnHeader column={column} title='Transfer Time' />
      ),
      cell: ({ row }: { row: Row<CryptoWithdrawal> }) => {
        const transferTime = row.original.transferTime
        return <div>{formatDate(transferTime)}</div>
      },
      enableSorting: false,
    },
  ]
}
