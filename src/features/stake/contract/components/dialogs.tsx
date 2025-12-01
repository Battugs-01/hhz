import { useCallback, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  stakeService,
  type StakeContract,
  type StakeContractCreateParams,
  type StakeContractUpdateParams,
} from '@/services'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import {
  ConfigFormDialog,
  type FormFieldConfig,
} from '@/components/ui/config-form-dialog'
import { QUERY_KEYS } from './constants'
import {
  STAKE_CONTRACT_FORM_FIELDS,
  stakeContractFormSchema,
  type StakeContractForm,
} from './schemas'

function StakeContractFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<StakeContract>) {
  const isEdit = !!data
  const queryClient = useQueryClient()

  const fetchAssetsOptions = useCallback(async (): Promise<
    Array<{ value: string; label: string; key: string }>
  > => {
    try {
      const res = await stakeService.listStakeAssets({})
      const assets = res?.body?.items || []
      return assets.map((asset) => ({
        key: asset.asset,
        value: asset.asset,
        label: `${asset.asset}${asset.stakeAssetTitle ? ` - ${asset.stakeAssetTitle}` : ''}`,
      }))
    } catch (error) {
      console.error('Failed to fetch assets:', error)
      toast.error('Failed to load assets. Please try again.')
      return []
    }
  }, [])

  const defaultValues = useMemo<Partial<StakeContractForm>>(() => {
    if (data) {
      return {
        asset: data.asset || '',
        stakeContractName: data.stakeContractName || '',
        duration: data.duration,
        apr: data.apr,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        decimalPlaces: data.decimalPlaces,
        cancelPolicies: data.cancelPolicies?.map((policy) => ({
          fromDay: policy.fromDay,
          toDay: policy.toDay,
          apr: policy.apr,
        })),
      }
    }
    return {
      asset: '',
      stakeContractName: '',
      duration: undefined,
      apr: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      decimalPlaces: undefined,
      cancelPolicies: [],
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (values: StakeContractForm) => {
      if (isEdit) {
        const contractId = data?.contractId || data?.stakeContractId
        if (!contractId) {
          throw new Error('Contract ID is required for update')
        }
        const apiParams: StakeContractUpdateParams = {
          asset: values.asset,
          stakeContractName: values.stakeContractName,
          duration: values.duration,
          apr: values.apr,
          minAmount: values.minAmount,
          maxAmount: values.maxAmount,
          decimalPlaces: values.decimalPlaces,
          cancelPolicies: values.cancelPolicies,
        }
        return await stakeService.updateStakeContract(contractId, apiParams)
      } else {
        const apiParams: StakeContractCreateParams = {
          asset: values.asset,
          stakeContractName: values.stakeContractName,
          duration: values.duration,
          apr: values.apr,
          minAmount: values.minAmount,
          maxAmount: values.maxAmount,
          decimalPlaces: values.decimalPlaces,
          cancelPolicies: values.cancelPolicies,
        }
        return await stakeService.createStakeContract(apiParams)
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? 'Stake contract updated successfully!'
          : 'Stake contract created successfully!'
      )
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STAKE_CONTRACT_LIST],
        exact: false,
      })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save stake contract')
    },
  })

  const fieldsWithOptions = useMemo<
    FormFieldConfig<StakeContractForm>[]
  >(() => {
    return STAKE_CONTRACT_FORM_FIELDS.map((field) => {
      if (field.name === 'asset') {
        return {
          ...field,
          disabled: isEdit,
          comboboxOptions: {
            fetchOptions: fetchAssetsOptions,
            placeholder: 'Search assets...',
          },
        }
      }
      if (field.name === 'duration') {
        return {
          ...field,
          disabled: isEdit,
        }
      }
      return field
    })
  }, [fetchAssetsOptions, isEdit])

  const handleSubmit = async (values: StakeContractForm): Promise<void> => {
    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      throw error
    }
  }

  return (
    <ConfigFormDialog<StakeContractForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<StakeContractForm>) : undefined}
      schema={stakeContractFormSchema}
      fields={fieldsWithOptions}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Stake Contract' : 'Create Stake Contract'}
      description={
        isEdit
          ? 'Update the stake contract here.'
          : 'Create a new stake contract here.'
      }
      submitButtonText={isEdit ? 'Update' : 'Create'}
      isSubmitting={mutation.isPending}
      defaultValues={defaultValues}
    />
  )
}

export const StakeContractDialogs = {
  StakeContractForm: StakeContractFormDialog,
}
