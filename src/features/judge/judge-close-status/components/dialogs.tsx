import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { JudgeCloseStatus } from '@/services'
import { judgeCloseStatusService } from '@/services'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { BaseDialog } from '@/components/ui/base-dialog'
import { ConfigFormDialog } from '@/components/ui/config-form-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { JUDGE_CLOSE_STATUS_FORM_FIELDS, QUERY_KEYS } from './constants'
import {
  judgeCloseStatusFormSchema,
  type JudgeCloseStatusForm,
} from './schemas'

interface JudgeCloseStatusFormDialogProps {
  open: boolean
  onClose: () => void
  data?: JudgeCloseStatus | null
}

export function JudgeCloseStatusFormDialog({
  open,
  onClose,
  data,
}: JudgeCloseStatusFormDialogProps) {
  const queryClient = useQueryClient()
  const isEdit = !!data

  const mutation = useMutation({
    mutationFn: async (formData: JudgeCloseStatusForm) => {
      if (isEdit) {
        return judgeCloseStatusService.updateJudgeCloseStatus(data.id, {
          id: data.id,
          ...formData,
        })
      }
      return judgeCloseStatusService.createJudgeCloseStatus(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.JUDGE_CLOSE_STATUS_LIST],
      })
      toast.success(
        isEdit ? 'Төлөв амжилттай шинэчлэгдлээ' : 'Төлөв амжилттай үүсгэгдлээ'
      )
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Алдаа гарлаа')
    },
  })

  const defaultValues = data
    ? {
        status: data.status,
        description: data.description,
        isActive: data.isActive,
      }
    : {
        status: '',
        description: '',
        isActive: true,
      }

  return (
    <ConfigFormDialog<JudgeCloseStatusForm>
      open={open}
      onClose={onClose}
      title={isEdit ? 'Төлөв засах' : 'Төлөв үүсгэх'}
      description={
        isEdit
          ? 'Шүүхийн хаах төлвийн мэдээллийг засна уу'
          : 'Шинэ шүүхийн хаах төлөв үүсгэнэ үү'
      }
      fields={JUDGE_CLOSE_STATUS_FORM_FIELDS}
      schema={judgeCloseStatusFormSchema}
      defaultValues={defaultValues}
      onSubmit={(formData) => mutation.mutate(formData)}
    />
  )
}

interface DeleteJudgeCloseStatusDialogProps {
  open: boolean
  onClose: () => void
  data: JudgeCloseStatus
}

export function DeleteJudgeCloseStatusDialog({
  open,
  onClose,
  data,
}: DeleteJudgeCloseStatusDialogProps) {
  const queryClient = useQueryClient()
  const [confirmStatus, setConfirmStatus] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      return judgeCloseStatusService.deleteJudgeCloseStatus(data.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.JUDGE_CLOSE_STATUS_LIST],
      })
      toast.success('Төлөв амжилттай устгагдлаа')
      setConfirmStatus('')
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Устгахад алдаа гарлаа')
    },
  })

  const handleDelete = () => {
    if (confirmStatus.trim() !== data.status) return
    mutation.mutate()
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setConfirmStatus('')
          onClose()
        }
      }}
      title={
        <span className='text-destructive flex items-center'>
          <AlertTriangle className='stroke-destructive me-2' size={18} />
          Төлөв устгах
        </span>
      }
      description='Энэ үйлдлийг буцаах боломжгүй. Устгахыг баталгаажуулна уу.'
      maxWidth='md'
      className='space-y-4'
      submitButton={{
        text: 'Устгах',
        onClick: handleDelete,
        disabled: confirmStatus.trim() !== data.status || mutation.isPending,
        loading: mutation.isPending,
      }}
      cancelButton={{
        text: 'Болих',
      }}
    >
      <div className='space-y-4'>
        <p>
          <span className='font-bold'>{data.status}</span>-г устгахдаа итгэлтэй
          байна уу?
        </p>
        <p className='text-muted-foreground text-sm'>{data.description}</p>

        <div className='space-y-2'>
          <Label>
            Баталгаажуулахын тулд төлөвийн нэр оруулна уу:{' '}
            <span className='font-mono text-sm'>{data.status}</span>
          </Label>
          <Input
            value={confirmStatus}
            onChange={(e) => setConfirmStatus(e.target.value)}
            placeholder={data.status}
          />
        </div>
      </div>
    </BaseDialog>
  )
}

export const JudgeCloseStatusDialogs = {
  Form: JudgeCloseStatusFormDialog,
  Delete: DeleteJudgeCloseStatusDialog,
}
