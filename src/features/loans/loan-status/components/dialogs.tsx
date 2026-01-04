import { useMemo } from 'react'
import { loanStatusService, type LoanStatus } from '@/services'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import {
  ConfigFormDialog,
  type FormFieldConfig,
} from '@/components/ui/config-form-dialog'
import { LOAN_STATUS_OPTIONS } from './constants'
import { loanStatusFormSchema, type LoanStatusForm } from './schemas'

const LOAN_STATUS_FORM_FIELDS: FormFieldConfig<LoanStatusForm>[] = [
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status...',
    required: true,
    options: LOAN_STATUS_OPTIONS,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter status description...',
    required: true,
  },
]

export function LoanStatusFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<LoanStatus>) {
  const isEdit = !!data

  const defaultValues = useMemo(() => {
    if (data) {
      return {
        status: data.status || '',
        description: data.description || '',
      }
    }
    return {
      status: '',
      description: '',
    }
  }, [data])

  const handleSubmit = async (values: LoanStatusForm): Promise<void> => {
    try {
      if (isEdit && data) {
        await loanStatusService.updateLoanStatus(data.id, {
          status: values.status,
          description: values.description,
        })
        toast.success('Loan status updated successfully!')
      } else {
        await loanStatusService.createLoanStatus({
          status: values.status,
          description: values.description,
        })
        toast.success('Loan status created successfully!')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save loan status'
      toast.error(errorMessage)
      throw error
    }
  }

  return (
    <ConfigFormDialog<LoanStatusForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<LoanStatusForm>) : undefined}
      schema={loanStatusFormSchema}
      fields={LOAN_STATUS_FORM_FIELDS}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Loan Status' : 'Add New Loan Status'}
      description={
        isEdit
          ? 'Update loan status information.'
          : 'Create a new loan status here.'
      }
      submitButtonText={isEdit ? 'Save Changes' : 'Create Loan Status'}
      defaultValues={defaultValues}
    />
  )
}
