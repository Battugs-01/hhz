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
import type { CustomerLoanItem } from '@/services'
import { Trash2 } from 'lucide-react'

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
            <TableHead>Утас1</TableHead>
            <TableHead>Зээл хэтэрсэн хоног</TableHead>
            <TableHead>Гэрийн хаяг</TableHead>
            <TableHead>Байршил</TableHead>
            <TableHead>Ажлын газар</TableHead>
            <TableHead>Тэмдэглэл</TableHead>
            <TableHead>Олгосон зээл</TableHead>
            <TableHead>Төлөх хүү</TableHead>
            <TableHead>Төлөх нэмэгдүүлсэн хүү</TableHead>
            <TableHead>Зээл хаах дүн</TableHead>
            <TableHead>Зээлийн төрөл</TableHead>
            <TableHead>Зээлийн ID</TableHead>
            <TableHead>Зээлийн огноо</TableHead>
            <TableHead>Төлөв</TableHead>
            <TableHead>Одоо төлбөл зохих дүн</TableHead>
            <TableHead>Дүүрэг</TableHead>
            <TableHead>Хороо</TableHead>
            <TableHead>Ажил</TableHead>
            <TableHead>Ажлын хаяг</TableHead>
            <TableHead>Одоо амьдарч байгаа хаяг</TableHead>
            <TableHead>Нэмэлт хаяг</TableHead>
            <TableHead>Эдийн засагчийн ID</TableHead>
            <TableHead className='w-[80px]'>Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={28}
                className='text-muted-foreground text-center'
              >
                Өгөгдөл байхгүй
              </TableCell>
            </TableRow>
          ) : (
            data.map((loan, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell className='font-mono text-xs'>{loan.registerNumber}</TableCell>
                <TableCell>{loan.lastName}</TableCell>
                <TableCell>{loan.firstName}</TableCell>
                <TableCell className='font-mono text-xs'>{loan.customerId}</TableCell>
                <TableCell className='font-mono text-xs'>{loan.phoneNumber}</TableCell>
                <TableCell className='text-center'>
                  {loan.overdueDay > 0 ? (
                    <Badge variant='destructive'>{loan.overdueDay}</Badge>
                  ) : (
                    <span className='text-muted-foreground'>0</span>
                  )}
                </TableCell>
                <TableCell className='max-w-[200px] truncate text-xs'>{loan.address || '-'}</TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>{loan.location || '-'}</TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>{loan.jobName || '-'}</TableCell>
                <TableCell className='max-w-[200px] truncate text-xs'>{loan.description || '-'}</TableCell>
                <TableCell className='text-right font-medium'>
                  {loan.loanAmount.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='text-right text-xs'>
                  {loan.payInterest.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='text-right text-xs'>
                  {loan.payExtraInterest.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='text-right text-xs'>
                  {loan.closePayAmount.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>{loan.loanType}</TableCell>
                <TableCell className='font-mono text-xs'>{loan.loanId}</TableCell>
                <TableCell className='font-mono text-xs'>{loan.loanDate}</TableCell>
                <TableCell>
                  <Badge variant='secondary'>{loan.status}</Badge>
                </TableCell>
                <TableCell className='text-right text-xs'>
                  {loan.payAmount.toLocaleString('mn-MN')}₮
                </TableCell>
                <TableCell className='text-xs'>{loan.district || '-'}</TableCell>
                <TableCell className='text-xs'>{loan.khoroo || '-'}</TableCell>
                <TableCell className='text-xs'>{loan.job || '-'}</TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>{loan.workLocation || '-'}</TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>{loan.currentLocation || '-'}</TableCell>
                <TableCell className='max-w-[150px] truncate text-xs'>{loan.additionalLocation || '-'}</TableCell>
                <TableCell className='text-center font-mono text-xs'>{loan.economist ?? '-'}</TableCell>
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
