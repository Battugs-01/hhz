import { Link } from '@tanstack/react-router'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { type Branch } from '@/services'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<Branch>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Branch> }) => {
        const id = row.getValue('id') as number
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm'>{id}</span>
            <CopyButton value={String(id)} />
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'branch',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Салбарын нэр' />
      ),
      cell: ({ row }: { row: Row<Branch> }) => {
        const branch = row.getValue('branch') as string
        const branchId = row.original.id
        return (
          <div className='ps-2'>
            <Link
              to='/branches/$branchId'
              params={{ branchId: String(branchId) }}
              className='hover:text-primary font-medium underline'
            >
              {branch}
            </Link>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Төлөв' />
      ),
      cell: ({ row }: { row: Row<Branch> }) => {
        const isActive = row.getValue('isActive') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Үүсгэсэн огноо' />
      ),
      cell: ({ row }: { row: Row<Branch> }) => {
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
      cell: ({ row }: { row: Row<Branch> }) => {
        const date = row.getValue('updatedAt') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: true,
    },
  ]
}
