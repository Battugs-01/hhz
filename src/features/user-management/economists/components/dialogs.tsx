import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { economistService, type Economist } from '@/services'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseDialog } from '@/components/ui/base-dialog'
import { ConfigFormDialog } from '@/components/ui/config-form-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ECONOMIST_FORM_FIELDS } from './constants'
import { economistFormSchema, type EconomistForm } from './schemas'

function EconomistFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<Economist>) {
  const isEdit = !!data

  const defaultValues = useMemo<Partial<EconomistForm>>(() => {
    if (data) {
      return {
        name: data.name || '',
        description: data.description || '',
        isActive: data.isActive ?? true,
      }
    }
    return {
      name: '',
      description: '',
      isActive: true,
    }
  }, [data])

  const handleSubmit = async (values: EconomistForm): Promise<void> => {
    try {
      if (isEdit && data) {
        await economistService.updateEconomist({
          id: data.id,
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        })
      } else {
        await economistService.createEconomist({
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        })
      }

      toast.success(
        isEdit
          ? 'Эдийн засагч амжилттай шинэчлэгдлээ!'
          : 'Эдийн засагч амжилттай үүсгэгдлээ!'
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Эдийн засагч хадгалахад алдаа гарлаа'
      toast.error(errorMessage)
      throw error
    }
  }

  return (
    <ConfigFormDialog<EconomistForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<EconomistForm>) : undefined}
      schema={economistFormSchema}
      fields={ECONOMIST_FORM_FIELDS}
      onSubmit={handleSubmit}
      title={isEdit ? 'Эдийн засагч засах' : 'Шинэ эдийн засагч нэмэх'}
      description={
        isEdit
          ? 'Эдийн засагчийн мэдээллийг шинэчлэх.'
          : 'Шинэ эдийн засагч үүсгэх.'
      }
      submitButtonText={isEdit ? 'Хадгалах' : 'Үүсгэх'}
      defaultValues={defaultValues}
    />
  )
}

interface DeleteEconomistDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  data: Economist
}

function DeleteEconomistDialog({
  open,
  onClose,
  onSuccess,
  data,
}: DeleteEconomistDialogProps) {
  const [confirmName, setConfirmName] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      await economistService.deleteEconomist(data.id)
    },
    onSuccess: () => {
      toast.success('Эдийн засагч амжилттай устгагдлаа!')
      setConfirmName('')
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Эдийн засагч устгахад алдаа гарлаа')
    },
  })

  const handleDelete = () => {
    if (confirmName.trim() !== data.name) return
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
          Эдийн засагч устгах
        </span>
      }
      description='Энэ үйлдлийг буцаах боломжгүй. Устгахыг баталгаажуулна уу.'
      maxWidth='md'
      className='space-y-4'
      submitButton={{
        text: 'Устгах',
        onClick: handleDelete,
        disabled: confirmName.trim() !== data.name || mutation.isPending,
        loading: mutation.isPending,
      }}
      cancelButton={{
        text: 'Болих',
      }}
    >
      <div className='space-y-4'>
        <p>
          <span className='font-bold'>{data.name}</span>
          -г устгахдаа итгэлтэй байна уу?
        </p>
        <p className='text-muted-foreground text-sm'>
          Энэ үйлдэл нь эдийн засагчийг системээс бүрмөсөн устгана.
        </p>

        <div className='space-y-2'>
          <Label>
            Баталгаажуулахын тулд нэр оруулна уу:{' '}
            <span className='font-mono text-sm'>{data.name}</span>
          </Label>
          <Input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder='Нэр оруулна уу'
            disabled={mutation.isPending}
          />
        </div>

        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertTitle>Анхааруулга!</AlertTitle>
          <AlertDescription>
            Болгоомжтой байна уу, энэ үйлдлийг буцаах боломжгүй.
          </AlertDescription>
        </Alert>
      </div>
    </BaseDialog>
  )
}

export const EconomistDialogs = {
  Form: EconomistFormDialog,
  Delete: DeleteEconomistDialog,
}

export { DeleteEconomistDialog, EconomistFormDialog }
