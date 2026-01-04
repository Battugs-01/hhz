import { type ColumnDef, type Row } from '@tanstack/react-table'
import type { LoanStatus } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { LOAN_STATUS_LABELS } from './constants'

interface CreateColumnsProps {
  onIdClick?: (loanStatus: LoanStatus) => void
}

export const createColumns = ({
  onIdClick,
}: CreateColumnsProps = {}): ColumnDef<LoanStatus>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<LoanStatus> }) => {
        const id = row.getValue('id') as number
        const loanStatus = row.original
        return (
          <div
            className='flex items-center gap-1 ps-2'
            onClick={(e) => {
              e.stopPropagation()
              if (onIdClick) {
                onIdClick(loanStatus)
              }
            }}
            style={{ cursor: onIdClick ? 'pointer' : 'default' }}
          >
            <span className='hover:text-primary font-mono text-sm text-nowrap underline'>
              {maskValue(String(id))}
            </span>
            <CopyButton value={String(id)} />
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Төлөв' />
      ),
      cell: ({ row }: { row: Row<LoanStatus> }) => {
        const status = row.getValue('status') as string
        const label = LOAN_STATUS_LABELS[status] || status
        return (
          <div className='flex items-center gap-2'>
            <Badge variant='secondary' className='font-medium'>
              {label}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тодорхойлол' />
      ),
      cell: ({ row }: { row: Row<LoanStatus> }) => {
        const description = row.getValue('description') as string
        return (
          <div className='max-w-[400px] ps-2'>
            <span className='line-clamp-2'>{description}</span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Үүсгэсэн огноо' />
      ),
      cell: ({ row }: { row: Row<LoanStatus> }) => {
        const date = row.getValue('createdAt') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Зассан огноо' />
      ),
      cell: ({ row }: { row: Row<LoanStatus> }) => {
        const date = row.getValue('updatedAt') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: true,
    },
  ]
}
