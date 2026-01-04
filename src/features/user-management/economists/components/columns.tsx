import { type ColumnDef, type Row } from '@tanstack/react-table'
import type { Economist } from '@/services'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<Economist>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Economist> }) => {
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Нэр' />
      ),
      cell: ({ row }: { row: Row<Economist> }) => {
        const name = row.getValue('name') as string
        return <div className='ps-2 font-medium'>{name}</div>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тайлбар' />
      ),
      cell: ({ row }: { row: Row<Economist> }) => {
        const description = row.getValue('description') as string
        return (
          <div className='text-muted-foreground max-w-[300px] truncate ps-2'>
            {description || '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Төлөв' />
      ),
      cell: ({ row }: { row: Row<Economist> }) => {
        const isActive = row.getValue('isActive') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Үүсгэсэн огноо' />
      ),
      cell: ({ row }: { row: Row<Economist> }) => {
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
      cell: ({ row }: { row: Row<Economist> }) => {
        const date = row.getValue('updatedAt') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: true,
    },
  ]
}
