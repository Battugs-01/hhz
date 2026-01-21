import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Loan, LoanNote } from '@/services'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

interface ColumnsProps {
  onLoanClick?: (loan: Loan) => void
}

export const createColumns = ({ onLoanClick }: ColumnsProps = {}): ColumnDef<LoanNote>[] => [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Огноо' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      try {
        return <span className='text-sm'>{format(new Date(date), 'yyyy-MM-dd HH:mm')}</span>
      } catch (e) {
        return <span className='text-sm'>{date}</span>
      }
    },
  },
  {
    accessorKey: 'loanId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Зээлийн ID' />
    ),
    cell: ({ row }) => {
      const loan = row.original.loan
      const loanId = loan?.loanId || row.original.loanId
      return (
        <span 
          className={onLoanClick ? "font-mono text-sm underline cursor-pointer hover:text-primary" : "font-mono text-sm"}
          onClick={() => onLoanClick?.(loan)}
        >
          {loanId}
        </span>
      )
    },
  },
  {
    id: 'customer',
    accessorFn: (row) => row.customer ? `${row.customer.lastName} ${row.customer.firstName}` : '-',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Харилцагч' />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer
      const loan = row.original.loan
      if (!customer) return <span className='text-muted-foreground'>-</span>
      return (
        <div 
          className={onLoanClick ? "flex flex-col cursor-pointer group" : "flex flex-col"}
          onClick={() => onLoanClick?.(loan)}
        >
          <span className={onLoanClick ? "font-medium text-sm group-hover:text-primary underline" : "font-medium text-sm"}>
            {customer.lastName} {customer.firstName}
          </span>
          <span className='text-[10px] text-muted-foreground font-mono'>{customer.registerNumber}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Тэмдэглэл' />
    ),
    cell: ({ row }) => <div className='max-w-[300px] whitespace-normal break-words py-1 text-sm'>{row.getValue('note')}</div>,
  },
  {
    accessorKey: 'isNear',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ойрхон' />
    ),
    cell: ({ row }) => {
      const isNear = row.getValue('isNear') as boolean
      return (
        <Badge variant={isNear ? 'default' : 'secondary'} className='text-[10px]'>
          {isNear ? 'Тийм' : 'Үгүй'}
        </Badge>
      )
    },
  },
  {
    id: 'createdBy',
    accessorFn: (row) => row.createdByAdmin ? `${row.createdByAdmin.lastName} ${row.createdByAdmin.firstName}` : '-',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Тэмдэглэсэн' />
    ),
    cell: ({ row }) => {
      const admin = row.original.createdByAdmin
      if (!admin) return <span className='text-muted-foreground'>-</span>
      return <span className='text-sm'>{admin.lastName} {admin.firstName}</span>
    },
  },
]
