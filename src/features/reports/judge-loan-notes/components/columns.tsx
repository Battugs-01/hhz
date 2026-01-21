import { DataTableColumnHeader } from '@/components/data-table'
import { JudgeLoan, JudgeLoanNote } from '@/services'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

interface ColumnsProps {
  onJudgeLoanClick?: (judgeLoan: JudgeLoan) => void
}

export const createColumns = ({ onJudgeLoanClick }: ColumnsProps = {}): ColumnDef<JudgeLoanNote>[] => [
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
    accessorKey: 'judgeLoanId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Шүүхийн зээл ID' />
    ),
    cell: ({ row }) => {
      const judgeLoan = row.original.judgeLoan
      const id = judgeLoan?.id || row.original.judgeLoanId
      return (
        <span 
          className={onJudgeLoanClick ? "font-mono text-sm underline cursor-pointer hover:text-primary" : "font-mono text-sm"}
          onClick={() => onJudgeLoanClick?.(judgeLoan)}
        >
          #{id}
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
      const judgeLoan = row.original.judgeLoan
      if (!customer) return <span className='text-muted-foreground'>-</span>
      return (
        <div 
          className={onJudgeLoanClick ? "flex flex-col cursor-pointer group" : "flex flex-col"}
          onClick={() => onJudgeLoanClick?.(judgeLoan)}
        >
          <span className={onJudgeLoanClick ? "font-medium text-sm group-hover:text-primary underline" : "font-medium text-sm"}>
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
    cell: ({ row }) => <div className='max-w-[400px] whitespace-normal break-words py-1 text-sm'>{row.getValue('note')}</div>,
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
