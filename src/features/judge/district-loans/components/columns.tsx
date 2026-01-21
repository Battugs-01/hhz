import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import type { JudgeLoan } from '@/services'
import type { ColumnDef, Row } from '@tanstack/react-table'

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('MNT', '₮')
}

// Get overdue status badge variant
const getOverdueVariant = (
  days: number
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (days === 0) return 'default'
  if (days <= 30) return 'secondary'
  if (days <= 60) return 'outline'
  return 'destructive'
}

interface CreateJudgeLoanColumnsProps {
  onLoanClick?: (record: JudgeLoan) => void
}

export const createJudgeLoanColumns = ({
  onLoanClick,
}: CreateJudgeLoanColumnsProps = {}): ColumnDef<JudgeLoan>[] => [
  {
    accessorKey: 'loan.loanId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Зээлийн ID' />
    ),
    cell: ({ row }: { row: Row<JudgeLoan> }) => {
      const id = row.original.loan.loanId
      const record = row.original
      return (
        <div
          className='flex items-center gap-1 ps-2'
          onClick={(e) => {
            e.stopPropagation()
            if (onLoanClick) {
              onLoanClick(record)
            }
          }}
          style={{ cursor: onLoanClick ? 'pointer' : 'default' }}
        >
          <span className='font-mono text-sm underline hover:text-primary'>
            {id}
          </span>
          <CopyButton value={id} />
        </div>
      )
    },
  },
  {
    accessorKey: 'loan.registerNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Регистр' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.original.loan.registerNumber}</span>
    ),
  },
  {
    id: 'customerName',
    accessorFn: (row) =>
      row.loan.customer
        ? `${row.loan.customer.lastName || ''} ${row.loan.customer.firstName || ''}`
        : '-',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Харилцагч' />
    ),
    cell: ({ row }) => {
      const customer = row.original.loan.customer
      if (!customer) return <span className='text-muted-foreground'>-</span>
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {customer.lastName} {customer.firstName}
          </span>
          <span className='text-xs text-muted-foreground'>
            {customer.customerId}
          </span>
        </div>
      )
    },
  },
  {
    id: 'phoneNumber',
    accessorFn: (row) => row.loan.customer?.phoneNumber || '-',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Утас' />
    ),
    cell: ({ row }) => {
      const phone = row.original.loan.customer?.phoneNumber
      if (!phone) return <span className='text-muted-foreground'>-</span>
      return (
        <div className='flex items-center gap-1'>
          <span className='font-mono text-sm'>{phone}</span>
          <CopyButton value={phone} />
        </div>
      )
    },
  },
  {
    accessorKey: 'loan.loanAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Олгосон зээл' />
    ),
    cell: ({ row }) => (
      <span className='font-bold text-primary'>
        {formatCurrency(row.original.loan.loanAmount)}
      </span>
    ),
  },
  {
    accessorKey: 'loan.interestRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Сарын хүү' />
    ),
    cell: ({ row }) => {
      const rate = row.original.loan.interestRate
      return (
        <span className='font-medium'>
          {rate ? `${rate}%` : '-'}
        </span>
      )
    },
  },
  {
    accessorKey: 'loan.payAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Төлөх дүн' />
    ),
    cell: ({ row }) => (
      <span className='font-semibold text-orange-600'>
        {formatCurrency(row.original.loan.payAmount)}
      </span>
    ),
  },
  {
    accessorKey: 'loan.overdueDay',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Хэтэрсэн хоног' />
    ),
    cell: ({ row }) => {
      const days = row.original.loan.overdueDay
      return <Badge variant={getOverdueVariant(days)}>{days} хоног</Badge>
    },
  },
  {
    accessorKey: 'loan.status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Төлөв' />
    ),
    cell: ({ row }) => <Badge variant='outline'>{row.original.loan.status}</Badge>,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Шүүхийн код' />
    ),
    cell: ({ row }) => <span className='font-mono'>{row.original.code}</span>,
  },
  {
    accessorKey: 'judge',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Шүүгч' />
    ),
  },
  {
    accessorKey: 'judgeAssistant',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Туслах' />
    ),
  },
  {
    accessorKey: 'invoiceNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Нэхэмжлэлийн №' />
    ),
  },
  {
    accessorKey: 'closeStatus.status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Шүүхийн төлөв' />
    ),
    cell: ({ row }) => (
      <Badge variant='secondary' className='whitespace-nowrap'>
        {row.original.closeStatus.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'ordinanceAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Шийдвэрлэсэн дүн' />
    ),
    cell: ({ row }) => {
      const amount = row.original.ordinanceAmount
      return amount ? (
        <span className='font-semibold text-blue-600'>
          {formatCurrency(amount)}
        </span>
      ) : (
        '-'
      )
    },
  },
  {
    accessorKey: 'stampFeeAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Тэмдэгтийн хураамж' />
    ),
    cell: ({ row }) => {
      const amount = row.original.stampFeeAmount
      return amount ? <span>{formatCurrency(amount)}</span> : '-'
    },
  },
  {
    accessorKey: 'refundStampFeeAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Буцаан олголт' />
    ),
    cell: ({ row }) => {
      const amount = row.original.refundStampFeeAmount
      return amount ? (
        <span className='text-green-600'>{formatCurrency(amount)}</span>
      ) : (
        '-'
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Бүртгэсэн огноо' />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt
      return date ? new Date(date).toLocaleDateString('mn-MN') : ''
    },
  },
]
