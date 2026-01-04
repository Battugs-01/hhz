import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  branchService,
  customerLoanService,
  type CustomerLoanItem,
} from '@/services'
import { Download, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import {
  generateExcelTemplate,
  parseExcelToCustomerLoans,
} from '@/lib/excel-utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Main } from '@/components/layout/main'
import { LoanImportTable } from './loan-import-table'

export function LoanImport() {
  const [loans, setLoans] = useState<CustomerLoanItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)

  // Fetch branches
  const { data: branchesData, isLoading: isLoadingBranches } = useQuery({
    queryKey: ['branches-list'],
    queryFn: async () => {
      const res = await branchService.listBranches({})
      return res?.body?.list || []
    },
  })

  const { mutate: createLoans, isPending } = useMutation({
    mutationFn: async (data: CustomerLoanItem[]) => {
      if (!selectedBranchId) {
        throw new Error('Салбар сонгоно уу')
      }
      return await customerLoanService.createCustomerAndLoans({
        branchId: selectedBranchId,
        list: data,
      })
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Зээлүүд амжилттай хадгалагдлаа!')
        setLoans([])
      } else {
        toast.error(response.message || 'Failed to save loans')
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save loans'
      )
    },
  })

  const handleDownloadTemplate = () => {
    try {
      generateExcelTemplate()
      toast.success('Template амжилттай татагдлаа')
    } catch (error) {
      toast.error('Template татахад алдаа гарлаа')
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const parsedLoans = await parseExcelToCustomerLoans(file)
      setLoans(parsedLoans)
      toast.success(`${parsedLoans.length} зээл амжилттай уншигдлаа`)
    } catch (error) {
      toast.error('Excel файл уншихад алдаа гарлаа')
      console.error('Error parsing Excel:', error)
    } finally {
      setIsUploading(false)
      // Reset input
      event.target.value = ''
    }
  }

  const handleSave = () => {
    if (loans.length === 0) {
      toast.error('Хадгалах өгөгдөл байхгүй байна')
      return
    }

    if (!selectedBranchId) {
      toast.error('Салбар сонгоно уу')
      return
    }

    createLoans(loans)
  }

  const handleRemoveLoan = (index: number) => {
    setLoans((prev) => prev.filter((_, i) => i !== index))
    toast.success('Мөр устгагдлаа')
  }

  const handleClear = () => {
    if (loans.length === 0) return
    setLoans([])
    toast.success('Бүх өгөгдөл цэвэрлэгдлээ')
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Зээл оруулах</CardTitle>
          <CardDescription>
            Excel файлаар зээлийн өгөгдлийг оруулна
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Branch Selection */}
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Label className='whitespace-nowrap'>Салбар:</Label>
              <Select
                value={selectedBranchId?.toString()}
                onValueChange={(value: string) =>
                  setSelectedBranchId(Number(value))
                }
                disabled={isLoadingBranches}
              >
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Салбар сонгох' />
                </SelectTrigger>
                <SelectContent>
                  {branchesData?.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBranchId && (
              <div className='bg-muted text-muted-foreground rounded-md px-3 py-1 text-sm'>
                Сонгогдсон салбар:{' '}
                <span className='font-medium'>
                  {branchesData?.find((b) => b.id === selectedBranchId)?.branch}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap items-center gap-3'>
            <Button
              variant='outline'
              onClick={handleDownloadTemplate}
              className='gap-2'
            >
              <Download className='h-4 w-4' />
              Template татах
            </Button>

            <Button variant='outline' className='relative gap-2'>
              <Upload className='h-4 w-4' />
              Файл оруулах
              <input
                type='file'
                accept='.xlsx,.xls'
                onChange={handleFileUpload}
                disabled={isUploading}
                className='absolute inset-0 cursor-pointer opacity-0'
              />
            </Button>

            {loans.length > 0 && (
              <>
                <Button
                  variant='outline'
                  onClick={handleClear}
                  className='text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2'
                >
                  <Trash2 className='h-4 w-4' />
                  Цэвэрлэх
                </Button>

                <div className='flex-1' />

                <Button
                  onClick={handleSave}
                  disabled={isPending || !selectedBranchId}
                >
                  {isPending
                    ? 'Хадгалж байна...'
                    : !selectedBranchId
                      ? 'Салбар сонгоно уу'
                      : `Хадгалах (${loans.length})`}
                </Button>
              </>
            )}
          </div>

          {/* Upload Status */}
          {isUploading && (
            <div className='text-muted-foreground text-center text-sm'>
              Файл уншиж байна...
            </div>
          )}

          {/* Data Table */}
          {loans.length > 0 && (
            <LoanImportTable data={loans} onRemove={handleRemoveLoan} />
          )}

          {/* Empty State */}
          {!isUploading && loans.length === 0 && (
            <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12 text-center'>
              <Upload className='text-muted-foreground h-10 w-10' />
              <div className='text-muted-foreground text-sm'>
                Template татаад Excel файл оруулна уу
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Main>
  )
}
