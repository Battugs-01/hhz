import { type ColumnDef, type Row } from '@tanstack/react-table'
import { type Admin, type AdminRole } from '@/services'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

const roleVariants: Record<
  AdminRole,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  super_admin: 'destructive',
  admin: 'default',
  manager: 'secondary',
  tag: 'outline',
  economist: 'secondary',
  accountant: 'outline',
}

const roleLabels: Record<AdminRole, string> = {
  super_admin: 'Супер Админ',
  admin: 'Админ',
  manager: 'Менежер',
  tag: 'Таг',
  economist: 'Эдийн засагч',
  accountant: 'Нягтлан бодогч',
}

export const createColumns = (): ColumnDef<Admin>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Admin> }) => {
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
      accessorKey: 'firstName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Нэр' />
      ),
      cell: ({ row }: { row: Row<Admin> }) => {
        const firstName = row.getValue('firstName') as string
        return <div className='ps-2'>{firstName}</div>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Овог' />
      ),
      cell: ({ row }: { row: Row<Admin> }) => {
        const lastName = row.getValue('lastName') as string
        return <div className='ps-2'>{lastName}</div>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='И-мэйл' />
      ),
      cell: ({ row }: { row: Row<Admin> }) => {
        const email = row.getValue('email') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='text-nowrap'>{email}</span>
            <CopyButton value={email} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Үүрэг' />
      ),
      cell: ({ row }: { row: Row<Admin> }) => {
        const role = row.getValue('role') as AdminRole
        return (
          <Badge variant={roleVariants[role]} className='capitalize'>
            {roleLabels[role]}
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
      cell: ({ row }: { row: Row<Admin> }) => {
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
      cell: ({ row }: { row: Row<Admin> }) => {
        const date = row.getValue('updatedAt') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: true,
    },
  ]
}
