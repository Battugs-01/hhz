import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TakeActionService, type TakeAction } from '@/services'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import {
  ConfigFormDialog,
} from '@/components/ui/config-form-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { QUERY_KEYS } from './constants'
import { TAKE_ACTION_FORM_FIELDS, takeActionFormSchema, type takeActionForm } from './schemas'

function TakeActionFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<TakeAction>) {
  const isEdit = !!data
  const queryClient = useQueryClient()

  const defaultValues = useMemo<Partial<takeActionForm>>(() => {
    if (data) {
      return {
        actionId: data.actionId,
        contentType: data.contentType,
        status: data.status,
        content: data.content,
        type: data.type,
      }
    }
    return {
      content: {
        mainTitle: 'Hello',
        mainDesc: '',
      },
      status: 'active',
      type: 'quiz',
      contentType: 'MARK_DOWN',
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (values: takeActionForm) => {
      console.log('Form values to submit:', values)
      // const apiParams = transformTakeActionToApiRequest(values)

      // if (isEdit && data) {
      //   return await TakeActionService.updateTakeAction(data.id, apiParams)
      // } else {
      //   return await TakeActionService.createTakeAction(apiParams as any)
      // }
    },
    onSuccess: () => {
      toast.success(
        isEdit ? 'TakeAction updated successfully!' : 'TakeAction created successfully!'
      )
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAKE_ACTION_LIST],
        exact: false,
      })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save TakeAction')
    },
  })

  const handleSubmit = async (values: takeActionForm): Promise<void> => {
    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      throw error
    }
  }

  return (
    <ConfigFormDialog<takeActionForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<takeActionForm>) : undefined}
      schema={takeActionFormSchema}
      fields={TAKE_ACTION_FORM_FIELDS}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit TakeAction' : 'Create TakeAction'}
      description={
        isEdit
          ? 'Update the TakeAction article here.'
          : 'Create a new TakeAction article here.'
      }
      submitButtonText={isEdit ? 'Update' : 'Create'}
      isSubmitting={mutation.isPending}
      defaultValues={defaultValues}
    />
  )
}

export const TakeActionDialogs = {
  TakeActionForm: TakeActionFormDialog,
}

export function TakeActionDeleteDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<TakeAction> & { data: TakeAction }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error('No data to delete')
      // await TakeActionService.deleteTakeAction(data.id)
    },
    onSuccess: () => {
      toast.success('TakeAction deleted successfully!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TAKE_ACTION_LIST] })
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete TakeAction')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      handleConfirm={handleDelete}
      title='Delete TakeAction'
      desc={`Are you sure you want to delete "${data?.contentType}"? This action cannot be undone.`}
      confirmText='Delete'
      cancelBtnText='Cancel'
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
