import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { adminService, type Admin } from '@/services'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseDialog } from '@/components/ui/base-dialog'
import {
  ConfigFormDialog,
  type FormFieldConfig,
} from '@/components/ui/config-form-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ADMIN_FORM_FIELDS } from './constants'
import { adminFormSchema, type AdminForm } from './schemas'

// Admin form fields configuration

function AdminFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<Admin>) {
  const isEdit = !!data

  const defaultValues = useMemo<Partial<AdminForm>>(() => {
    if (data) {
      return {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        role: data.role || 'admin',
        password: '',
        confirmPassword: '',
        isEdit: true,
      }
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      role: 'admin',
      password: '',
      confirmPassword: '',
      isEdit: false,
    }
  }, [data])

  const fieldsWithConditions = useMemo<FormFieldConfig<AdminForm>[]>(() => {
    return ADMIN_FORM_FIELDS.map((field) => {
      // Hide password fields in edit mode
      if (field.name === 'password' && isEdit) {
        return {
          ...field,
          showWhen: {
            field: 'isEdit' as keyof AdminForm,
            value: false,
          },
        }
      }
      if (field.name === 'confirmPassword' && isEdit) {
        return {
          ...field,
          showWhen: {
            field: 'isEdit' as keyof AdminForm,
            value: false,
          },
        }
      }
      return field
    })
  }, [isEdit])

  const handleSubmit = async (values: AdminForm): Promise<void> => {
    try {
      if (isEdit && data) {
        const updateData: any = {
          id: data.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          role: values.role,
        }

        if (values.password) {
          updateData.password = values.password
        }

        await adminService.updateAdmin(updateData)
      } else {
        // Create - password required
        if (!values.password || !values.password.trim()) {
          throw new Error('Password is required')
        }

        await adminService.createAdmin({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          role: values.role,
          password: values.password,
        })
      }

      toast.success(
        isEdit ? 'Админ амжилттай шинэчлэгдлээ!' : 'Админ амжилттай үүсгэгдлээ!'
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Админ хадгалахад алдаа гарлаа'
      toast.error(errorMessage)
      throw error
    }
  }

  return (
    <ConfigFormDialog<AdminForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<AdminForm>) : undefined}
      schema={adminFormSchema}
      fields={fieldsWithConditions}
      onSubmit={handleSubmit}
      title={isEdit ? 'Админ засах' : 'Шинэ админ нэмэх'}
      description={
        isEdit
          ? 'Админ хэрэглэгчийн мэдээллийг шинэчлэх.'
          : 'Шинэ админ хэрэглэгч үүсгэх.'
      }
      submitButtonText={isEdit ? 'Хадгалах' : 'Үүсгэх'}
      defaultValues={defaultValues}
    />
  )
}

interface DeleteAdminDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  data: Admin
}

function DeleteAdminDialog({
  open,
  onClose,
  onSuccess,
  data,
}: DeleteAdminDialogProps) {
  const [confirmEmail, setConfirmEmail] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      await adminService.deleteAdmin(data.id)
    },
    onSuccess: () => {
      toast.success('Админ амжилттай устгагдлаа!')
      setConfirmEmail('')
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Админ устгахад алдаа гарлаа')
    },
  })

  const handleDelete = () => {
    if (confirmEmail.trim() !== data.email) return
    mutation.mutate()
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setConfirmEmail('')
          onClose()
        }
      }}
      title={
        <span className='text-destructive flex items-center'>
          <AlertTriangle className='stroke-destructive me-2' size={18} />
          Админ устгах
        </span>
      }
      description='Энэ үйлдлийг буцаах боломжгүй. Устгахыг баталгаажуулна уу.'
      maxWidth='md'
      className='space-y-4'
      submitButton={{
        text: 'Устгах',
        onClick: handleDelete,
        disabled: confirmEmail.trim() !== data.email || mutation.isPending,
        loading: mutation.isPending,
      }}
      cancelButton={{
        text: 'Болих',
      }}
    >
      <div className='space-y-4'>
        <p>
          <span className='font-bold'>
            {data.firstName} {data.lastName}
          </span>
          -г устгахдаа итгэлтэй байна уу?
        </p>
        <p className='text-muted-foreground text-sm'>
          Энэ үйлдэл нь{' '}
          <span className='font-bold'>{data.role.toUpperCase()}</span> эрхтэй
          админыг системээс бүрмөсөн устгана.
        </p>

        <div className='space-y-2'>
          <Label>
            Баталгаажуулахын тулд и-мэйл оруулна уу:{' '}
            <span className='font-mono text-sm'>{data.email}</span>
          </Label>
          <Input
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder='И-мэйл хаяг оруулна уу'
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

export const AdminDialogs = {
  Form: AdminFormDialog,
  Delete: DeleteAdminDialog,
}

// Individual exports for convenience
export const AddAdminDialog = AdminFormDialog
export const EditAdminDialog = AdminFormDialog
export { DeleteAdminDialog }
