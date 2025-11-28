import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import type { News } from '@/services'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'

export const createColumns = (): ColumnDef<News>[] => {
  return [
    {
      accessorKey: 'nameMon',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Name (Mon)' />
      ),
      cell: ({ row }: { row: Row<News> }) => {
        const nameMon = row.getValue('nameMon') as string
        return (
          <div className='max-w-[300px] truncate font-medium' title={nameMon}>
            {nameMon}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'nameEng',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Name (Eng)' />
      ),
      cell: ({ row }: { row: Row<News> }) => {
        const nameEng = row.getValue('nameEng') as string
        return (
          <div className='max-w-[300px] truncate font-medium' title={nameEng}>
            {nameEng}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'category',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Category' />
      ),
      cell: ({ row }: { row: Row<News> }) => (
        <Badge variant='outline' className='capitalize'>
          {row.getValue('category')}
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }: { row: Row<News> }) => {
        const status = row.getValue('status') as 'active' | 'inactive'
        return (
          <Badge variant={status === 'active' ? 'success' : 'secondary'}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'views',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Views' />
      ),
      cell: ({ row }: { row: Row<News> }) => {
        const views = row.getValue('views') as number | undefined
        return (
          <div className='text-sm'>
            {views !== undefined ? views.toLocaleString() : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Published At' />
      ),
      cell: ({ row }: { row: Row<News> }) => {
        const publishedAt = row.getValue('publishedAt') as string | undefined
        return (
          <div className='text-muted-foreground text-sm'>
            {publishedAt ? formatDate(publishedAt) : '-'}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<News> }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ row }: { row: Row<News> }) => {
        const date = row.getValue('createdAt') as string
        return <div className='text-sm'>{formatDate(date)}</div>
      },
      enableSorting: false,
    },
  ]
}
