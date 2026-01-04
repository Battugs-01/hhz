import { type ColumnDef, type Row } from '@tanstack/react-table'
import { type Customer } from '@/services'
import { formatDate, maskValue } from '@/lib/utils'
import { CopyButton } from '@/components/copy-button'
import { DataTableColumnHeader } from '@/components/data-table'

interface CreateColumnsProps {
  onIdClick?: (customer: Customer) => void
}

export const createColumns = ({
  onIdClick,
}: CreateColumnsProps = {}): ColumnDef<Customer>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const id = row.getValue('id') as number
        const customer = row.original
        return (
          <div
            className='flex items-center gap-1 ps-2'
            onClick={(e) => {
              e.stopPropagation()
              if (onIdClick) {
                onIdClick(customer)
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
      accessorKey: 'customerId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Харилцагчийн ID' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const customerId = row.getValue('customerId') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm font-medium'>{customerId}</span>
            <CopyButton value={customerId} />
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
      cell: ({ row }: { row: Row<Customer> }) => {
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
      cell: ({ row }: { row: Row<Customer> }) => {
        const lastName = row.getValue('lastName') as string
        return <div className='ps-2'>{lastName}</div>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'registerNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Регистрийн дугаар' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const registerNumber = row.getValue('registerNumber') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='font-mono text-sm text-nowrap'>
              {registerNumber}
            </span>
            <CopyButton value={registerNumber} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Утас' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const phone = row.getValue('phoneNumber') as string
        return (
          <div className='flex items-center gap-1 ps-2'>
            <span className='text-nowrap'>{phone}</span>
            <CopyButton value={phone} />
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'district',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дүүрэг' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const district = row.getValue('district') as string | undefined
        return <div className='ps-2'>{district || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'jobName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ажил' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const jobName = row.getValue('jobName') as string | undefined
        return <div className='ps-2'>{jobName || '-'}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Үүсгэсэн огноо' />
      ),
      cell: ({ row }: { row: Row<Customer> }) => {
        const date = row.getValue('createdAt') as Date | string | undefined
        return <div>{formatDate(date)}</div>
      },
      enableSorting: true,
    },
  ]
}
