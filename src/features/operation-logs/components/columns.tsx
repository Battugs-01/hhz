import { Badge } from '@/components/ui/badge'
import { type OperationLog } from '@/services'
import { ColumnDef } from '@tanstack/react-table'

export const createColumns = (): ColumnDef<OperationLog>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <span className='font-mono'>#{row.original.id}</span>,
  },
  {
    accessorKey: 'method',
    header: 'Арга',
    cell: ({ row }) => {
      const method = row.original.method
      let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline'
      
      switch (method) {
        case 'GET': variant = 'secondary'; break
        case 'POST': variant = 'default'; break
        case 'PUT': variant = 'outline'; break
        case 'DELETE': variant = 'destructive'; break
      }

      return <Badge variant={variant} className='text-[10px]'>{method}</Badge>
    },
  },
  {
    accessorKey: 'type',
    header: 'Төрөл',
    cell: ({ row }) => <Badge variant='secondary' className='text-[10px]'>{row.original.type}</Badge>,
  },
  {
    accessorKey: 'requestUrl',
    header: 'URL',
    cell: ({ row }) => <span className='text-xs font-mono break-all'>{row.original.requestUrl}</span>,
  },
  {
    accessorKey: 'statusCode',
    header: 'Статус',
    cell: ({ row }) => {
      const status = row.original.statusCode
      const isSuccess = status >= 200 && status < 300
      return (
        <Badge variant={isSuccess ? 'outline' : 'destructive'} className='text-[10px] font-mono'>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'user',
    header: 'Хэрэглэгч',
    cell: ({ row }) => {
      const user = row.original.user
      if (!user) return '-'
      return (
        <div className='flex flex-col'>
          <span className='text-xs font-medium'>{user.firstName} {user.lastName}</span>
          <span className='text-muted-foreground text-[10px]'>{user.role}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP / Төхөөрөмж',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='text-xs font-mono'>{row.original.ipAddress}</span>
        <span className='text-muted-foreground text-[10px] truncate max-w-[150px]'>{row.original.deviceType}</span>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Огноо',
    cell: ({ row }) => (
      <span className='text-xs text-muted-foreground'>
        {new Date(row.original.createdAt).toLocaleString('mn-MN')}
      </span>
    ),
  },
]
