import type { CustomerLoanItem } from '@/services'
import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface LoanImportTableProps {
  data: CustomerLoanItem[]
  onRemove: (index: number) => void
}

export function LoanImportTable({ data, onRemove }: LoanImportTableProps) {
  return (
    <div className='max-h-[calc(100vh-400px)] w-full overflow-auto rounded-md border'>
      <Table className='min-w-[2000px]'>
        <TableHeader className='bg-background sticky top-0 z-10'>
          <TableRow>
            <TableHead className='w-[50px]'>#</TableHead>
            <TableHead>Регистр</TableHead>
            <TableHead>Овог</TableHead>
            <TableHead>Нэр</TableHead>
            <TableHead>Харилцагчийн ID</TableHead>
            <TableHead>Утас</TableHead>
            <TableHead>Хэтэрсэн хоног</TableHead>
            <TableHead>Гэрийн хаяг</TableHead>
            <TableHead>Дүүрэг</TableHead>
            <TableHead>Хороо</TableHead>
            <TableHead>Зээлийн ID</TableHead>
            <TableHead>Олгосон зээл</TableHead>
            <TableHead>Төлөх хүү</TableHead>
            <TableHead>Зээл хаах дүн</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Төрөл</TableHead>
            <TableHead>Огноо</TableHead>
            <TableHead>Эдийн засагч</TableHead>
            <TableHead className='w-[80px]'>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={19}
                className='text-muted-foreground text-center'
              >
                Өгөгдөл байхгүй
              </TableCell>
            </TableRow>
          ) : (
            data.map((loan, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell className='font-mono text-xs'>
                  {loan.registerNumber}
                </TableCell>
                <TableCell>{loan.lastName}</TableCell>
                <TableCell>{loan.firstName}</TableCell>
                <TableCell className='font-mono text-xs'>
                  {loan.customerId}
                </TableCell>
                <TableCell className='font-mono text-xs'>
                  {loan.phoneNumber}
                </TableCell>
                <TableCell className='text-center'>
                  {loan.overdueDay > 0 ? (
                    <Badge variant='destructive'>{loan.overdueDay}</Badge>
                  ) : (
                    <span className='text-muted-foreground'>0</span>
                  )}
                </TableCell>
                <TableCell className='max-w-[200px] truncate text-xs'>
                  {loan.address || '-'}
                </TableCell>
                <TableCell className='text-xs'>
                  {loan.district || '-'}
                </TableCell>
                <TableCell className='text-xs'>{loan.khoroo || '-'}</TableCell>
                <TableCell className='font-mono text-xs'>
                  {loan.loanId}
                </TableCell>
                <TableCell className='text-right font-medium'>
                  {loan.loanAmount.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='text-right text-xs'>
                  {loan.payInterest.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='text-right text-xs'>
                  {loan.closePayAmount.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>{loan.status}</Badge>
                </TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>
                  {loan.loanType}
                </TableCell>
                <TableCell className='font-mono text-xs'>
                  {loan.loanDate}
                </TableCell>
                <TableCell className='text-center font-mono text-xs'>
                  {loan.economistId || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onRemove(index)}
                    title='Устгах'
                  >
                    <Trash2 className='text-destructive h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
