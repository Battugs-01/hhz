import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { branchService, type Branch } from '@/services'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseDialog } from '@/components/ui/base-dialog'
import { ConfigFormDialog } from '@/components/ui/config-form-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BRANCH_FORM_FIELDS } from './constants'
import { branchFormSchema, type BranchForm } from './schemas'

function BranchFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<Branch>) {
  const isEdit = !!data

  const defaultValues = useMemo<Partial<BranchForm>>(() => {
    if (data) {
      return {
        branch: data.branch || '',
        isActive: data.isActive ?? true,
      }
    }
    return {
      branch: '',
      isActive: true,
    }
  }, [data])

  const handleSubmit = async (values: BranchForm): Promise<void> => {
    try {
      if (isEdit && data) {
        await branchService.updateBranch({
          id: data.id,
          branch: values.branch,
          isActive: values.isActive,
        })
      } else {
        await branchService.createBranch({
          branch: values.branch,
          isActive: values.isActive,
        })
      }

      toast.success(
        isEdit ? 'Салбар амжилттай шинэчлэгдлээ!' : 'Салбар амжилттай үүслээ!'
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Салбар хадгалахад алдаа гарлаа'
      toast.error(errorMessage)
      throw error
    }
  }

  return (
    <ConfigFormDialog<BranchForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<BranchForm>) : undefined}
      schema={branchFormSchema}
      fields={BRANCH_FORM_FIELDS}
      onSubmit={handleSubmit}
      title={isEdit ? 'Салбар засах' : 'Шинэ салбар нэмэх'}
      description={
        isEdit ? 'Салбарын мэдээллийг шинэчлэх.' : 'Шинэ салбар үүсгэх.'
      }
      submitButtonText={isEdit ? 'Хадгалах' : 'Үүсгэх'}
      defaultValues={defaultValues}
    />
  )
}

interface DeleteBranchDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  data: Branch
}

function DeleteBranchDialog({
  open,
  onClose,
  onSuccess,
  data,
}: DeleteBranchDialogProps) {
  const [confirmName, setConfirmName] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      await branchService.deleteBranch(data.id)
    },
    onSuccess: () => {
      toast.success('Салбар амжилттай устгагдлаа!')
      setConfirmName('')
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Салбар устгахад алдаа гарлаа')
    },
  })

  const handleDelete = () => {
    if (confirmName.trim() !== data.branch) return
    mutation.mutate()
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setConfirmName('')
          onClose()
        }
      }}
      title={
        <span className='text-destructive flex items-center'>
          <AlertTriangle className='stroke-destructive me-2' size={18} />
          Салбар устгах
        </span>
      }
      description='Энэ үйлдлийг буцаах боломжгүй. Устгахыг батлана уу.'
      maxWidth='md'
      className='space-y-4'
      submitButton={{
        text: 'Устгах',
        onClick: handleDelete,
        disabled: confirmName.trim() !== data.branch || mutation.isPending,
        loading: mutation.isPending,
      }}
      cancelButton={{
        text: 'Цуцлах',
      }}
    >
      <div className='space-y-4'>
        <p>
          <span className='font-bold'>{data.branch}</span> салбарыг устгахдаа
          итгэлтэй байна уу?
        </p>
        <p className='text-muted-foreground text-sm'>
          Энэ үйлдэл нь салбарыг системээс бүрмөсөн устгана.
        </p>

        <div className='space-y-2'>
          <Label>
            Салбарын нэрийг оруулж баталгаажуулна уу:{' '}
            <span className='font-mono text-sm'>{data.branch}</span>
          </Label>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder='Устгахыг батлахын тулд салбарын нэрийг оруулна уу'
            disabled={mutation.isPending}
          />
        </div>

        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Анхааруулга!</AlertTitle>
          <AlertDescription>
            Энэ үйлдлийг буцаах боломжгүй тул болгоомжтой хандана уу.
          </AlertDescription>
        </Alert>
      </div>
    </BaseDialog>
  )
}

export const BranchDialogs = {
  Form: BranchFormDialog,
  Delete: DeleteBranchDialog,
}

export const AddBranchDialog = BranchFormDialog
export const EditBranchDialog = BranchFormDialog
export { DeleteBranchDialog }
