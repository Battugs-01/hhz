import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type ExchangeTxn } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { getStatusVariant } from './constants'

export const createColumns = (): ColumnDef<ExchangeTxn>[] => {
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
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
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
      accessorKey: 'amount',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Amount' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const amount = row.getValue('amount') as number | undefined
        const currency = row.original.currency
        if (amount === undefined) return <div>-</div>
        return (
          <div className='ps-2 font-medium'>
            {amount.toLocaleString()} {currency || ''}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'currency',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Currency' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const currency = row.getValue('currency') as string | undefined
        return <div className='ps-2'>{currency || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const status = row.getValue('status') as string | undefined
        if (!status) return <div>-</div>
        return (
          <Badge variant={getStatusVariant(status)} className='capitalize'>
            {status}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'reason',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Reason' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const reason = row.getValue('reason') as string | undefined
        return <div className='ps-2'>{reason || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'receiverName',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Receiver Name' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const receiverName = row.getValue('receiverName') as string | undefined
        return <div className='ps-2'>{receiverName || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'receiverIBAN',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Receiver IBAN' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const receiverIBAN = row.getValue('receiverIBAN') as string | undefined
        if (!receiverIBAN) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(receiverIBAN)}</span>
            <CopyButton value={receiverIBAN} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'senderIBAN',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Sender IBAN' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const senderIBAN = row.getValue('senderIBAN') as string | undefined
        if (!senderIBAN) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(senderIBAN)}</span>
            <CopyButton value={senderIBAN} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'bankResponse.journalNo',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Journal No' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const journalNo = row.original.bankResponse?.journalNo
        return (
          <div className='ps-2'>
            {journalNo ? journalNo.toLocaleString() : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'metadata.userId',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='User ID' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const userId = row.original.metadata?.userId
        if (!userId) return <div>-</div>
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{maskValue(userId)}</span>
            <CopyButton value={userId} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'transferTime',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Transfer Time' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const transferTime = row.getValue('transferTime') as string | undefined
        return <div>{transferTime ? formatDate(transferTime) : '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }: { column: Column<ExchangeTxn> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<ExchangeTxn> }) => {
        const createdAt = row.getValue('created_at') as string
        return <div>{formatDate(createdAt)}</div>
      },
      enableSorting: false,
    },
  ]
}
