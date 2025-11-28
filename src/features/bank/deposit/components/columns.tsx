import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type Deposit } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

type CreateColumnsOptions = {
  onIdClick?: (deposit: Deposit) => void
}

export const createColumns = (
  options?: CreateColumnsOptions
): ColumnDef<Deposit>[] => {
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
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
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
      accessorKey: 'depositAmount',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Deposit Amount' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
        const amount = row.getValue('depositAmount') as number
        const currency = row.original.currency
        return (
          <div className='ps-2 font-medium'>
            {amount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'currency',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Currency' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('currency')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant={getStatusVariant(status)} className='capitalize'>
            {status}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'txnId',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Transaction ID' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
        const txnId = row.getValue('txnId') as string | undefined
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
      accessorKey: 'txnAmount',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Transaction Amount' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
        const txnAmount = row.getValue('txnAmount') as number | undefined
        const currency = row.original.currency
        if (txnAmount === undefined) return <div>-</div>
        return (
          <div className='ps-2'>
            {txnAmount.toLocaleString()} {currency}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'paymentWalletId',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Payment Wallet ID' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
        const paymentWalletId = row.getValue('paymentWalletId') as
          | string
          | undefined
        return <div className='ps-2'>{paymentWalletId || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'transferTime',
      header: ({ column }: { column: Column<Deposit> }) => (
        <DataTableColumnHeader column={column} title='Transfer Time' />
      ),
      cell: ({ row }: { row: Row<Deposit> }) => {
        const transferTime = row.getValue('transferTime') as string | undefined
        return <div>{formatDate(transferTime)}</div>
      },
      enableSorting: false,
    },
  ]
}
