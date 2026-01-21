import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { type Loan } from '@/services'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { MapPin } from 'lucide-react'

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

// Format loan date (20240101 -> 2024-01-01)
const formatLoanDate = (dateNum: number): string => {
  const dateStr = String(dateNum)
  if (dateStr.length !== 8) return dateStr
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  return `${year}-${month}-${day}`
}

// Get overdue status badge variant
const getOverdueVariant = (
  days: number
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (days === 0) return 'default'
  if (days === 0) return 'default'
  if (days <= 30) return 'secondary'
  if (days <= 60) return 'outline'
  return 'destructive'
}

const getOverdueLabel = (days: number): string => {
  if (days === 0) return 'Хэвийн'
  if (days === 0) return 'Хэвийн'
  if (days <= 30) return 'Анхаарал'
  if (days <= 60) return 'Муу зээл'
  return 'Ноцтой'
}

// Location cell component
const LocationCell = ({
  location,
  label,
}: {
  location?: string
  label: string
}) => {
  if (!location) return <span className='text-muted-foreground'>-</span>

  const openInMaps = () => {
    const [lat, lng] = location.split(' ')
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='h-6 gap-1 px-2 text-xs'
            onClick={openInMaps}
          >
            <MapPin className='h-3 w-3' />
            <span className='max-w-[100px] truncate font-mono text-[10px]'>
              {location}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
          <p className='font-mono text-xs'>{location}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface CreateLoanColumnsProps {
  onLoanClick?: (loan: Loan) => void
}

export const createLoanColumns = ({
  onLoanClick,
}: CreateLoanColumnsProps = {}): ColumnDef<Loan>[] => {
  return [
    // ===== ЗЭЭЛИЙН МЭДЭЭЛЭЛ =====
    {
      accessorKey: 'loanId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Зээлийн ID' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const id = row.getValue('loanId') as string
        const loan = row.original
        return (
          <div
            className='flex items-center gap-1 ps-2'
            onClick={(e) => {
              e.stopPropagation()
              if (onLoanClick) {
                onLoanClick(loan)
              }
            }}
            style={{ cursor: onLoanClick ? 'pointer' : 'default' }}
          >
            <span className='hover:text-primary font-mono text-sm underline'>
              {id}
            </span>
            <CopyButton value={id} />
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'registerNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Регистр' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const registerNumber = row.getValue('registerNumber') as string
        return <span className='font-mono text-sm'>{registerNumber}</span>
      },
      enableSorting: true,
    },
    // ===== ХАРИЛЦАГЧИЙН МЭДЭЭЛЭЛ =====
    {
      id: 'customerName',
      accessorFn: (row) =>
        row.customer
          ? `${row.customer.lastName || ''} ${row.customer.firstName || ''}`
          : '-',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Харилцагч' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const customer = row.original.customer
        if (!customer) return <span className='text-muted-foreground'>-</span>
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>
              {customer.lastName} {customer.firstName}
            </span>
            <span className='text-muted-foreground text-xs'>
              {customer.customerId}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      id: 'phoneNumber',
      accessorFn: (row) => row.customer?.phoneNumber || '-',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Утас' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const phone = row.original.customer?.phoneNumber
        if (!phone) return <span className='text-muted-foreground'>-</span>
        return (
          <div className='flex items-center gap-1'>
            <span className='font-mono text-sm'>{phone}</span>
            <CopyButton value={phone} />
          </div>
        )
      },
      enableSorting: true,
    },
    {
      id: 'job',
      accessorFn: (row) => row.customer?.job || '-',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ажил' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const customer = row.original.customer
        if (!customer) return <span className='text-muted-foreground'>-</span>
        return (
          <div className='flex flex-col'>
            <span className='text-sm'>{customer.job || '-'}</span>
            <span className='text-muted-foreground text-xs'>
              {customer.jobName || '-'}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    // ===== ХАЯГИЙН МЭДЭЭЛЭЛ =====
    {
      id: 'address',
      accessorFn: (row) => row.customer?.address || '-',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Гэрийн хаяг' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const customer = row.original.customer
        if (!customer) return <span className='text-muted-foreground'>-</span>
        return (
          <div className='flex flex-col'>
            <span className='max-w-[150px] truncate text-sm'>
              {customer.address || '-'}
            </span>
            <span className='text-muted-foreground text-xs'>
              {customer.district}, {customer.khoroo}
            </span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      id: 'location',
      accessorFn: (row) => row.customer?.location || '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Байршил' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => (
        <LocationCell
          location={row.original.customer?.location}
          label='Гэрийн байршил'
        />
      ),
      enableSorting: false,
    },
    {
      id: 'currentLocation',
      accessorFn: (row) => row.customer?.currentLocation || '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Одоогийн байршил' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => (
        <LocationCell
          location={row.original.customer?.currentLocation}
          label='Одоо амьдарч байгаа хаяг'
        />
      ),
      enableSorting: false,
    },
    {
      id: 'workLocation',
      accessorFn: (row) => row.customer?.workLocation || '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ажлын байршил' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => (
        <LocationCell
          location={row.original.customer?.workLocation}
          label='Ажлын газрын байршил'
        />
      ),
      enableSorting: false,
    },
    {
      id: 'additionalLocation',
      accessorFn: (row) => row.customer?.additionalLocation || '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Нэмэлт байршил' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => (
        <LocationCell
          location={row.original.customer?.additionalLocation}
          label='Нэмэлт байршил'
        />
      ),
      enableSorting: false,
    },
    // ===== ЗЭЭЛИЙН ДҮН =====
    {
      accessorKey: 'loanAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Олгосон зээл' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const amount = row.getValue('loanAmount') as number
        return (
          <span className='text-primary font-bold'>
            {formatCurrency(amount)}
          </span>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'interestRate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Сарын хүү' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const rate = row.getValue('interestRate') as number | undefined
        return (
          <span className='font-medium'>
            {rate ? `${rate}%` : '-'}
          </span>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'closePayAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Хаах дүн' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const amount = row.getValue('closePayAmount') as number
        return <span className='font-semibold'>{formatCurrency(amount)}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'payAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Төлөх дүн' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const amount = row.getValue('payAmount') as number
        return (
          <span className='font-semibold text-orange-600'>
            {formatCurrency(amount)}
          </span>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'payInterest',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Хүү' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const amount = row.getValue('payInterest') as number
        return <span className='text-sm'>{formatCurrency(amount)}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'payExtraInterest',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Нэмэгдэл хүү' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const amount = row.getValue('payExtraInterest') as number
        return (
          <span className='text-destructive text-sm'>
            {formatCurrency(amount)}
          </span>
        )
      },
      enableSorting: true,
    },
    // ===== ТӨЛӨВ =====
    {
      accessorKey: 'overdueDay',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Хэтэрсэн хоног' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const days = row.getValue('overdueDay') as number
        return <Badge variant={getOverdueVariant(days)}>{days} хоног</Badge>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Төлөв' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const status = row.getValue('status') as string
        return <Badge variant='outline'>{status}</Badge>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'loanType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Зээлийн төрөл' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const loanType = row.getValue('loanType') as string
        return <span>{loanType}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'loanDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Огноо' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const date = row.getValue('loanDate') as number
        return <span>{formatLoanDate(date)}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'economistId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Эдийн засагч' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const economistId = row.getValue('economistId') as number | null
        if (!economistId)
          return <span className='text-muted-foreground'>-</span>
        return <span className='font-mono text-sm'>#{economistId}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тайлбар' />
      ),
      cell: ({ row }: { row: Row<Loan> }) => {
        const description = row.getValue('description') as string
        return (
          <span className='text-muted-foreground max-w-[200px] truncate'>
            {description || '-'}
          </span>
        )
      },
      enableSorting: false,
    },
  ]
}
