import { useCallback, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  cryptoService,
  stakeService,
  type StakeAsset,
  type StakeAssetCreateParams,
  type StakeAssetUpdateParams,
} from '@/services'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import {
  ConfigFormDialog,
  type FormFieldConfig,
} from '@/components/ui/config-form-dialog'
import { QUERY_KEYS } from './constants'
import {
  STAKE_ASSET_FORM_FIELDS,
  stakeAssetFormSchema,
  type StakeAssetForm,
} from './schemas'

function StakeAssetFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<StakeAsset>) {
  const isEdit = !!data
  const queryClient = useQueryClient()

  const fetchCoinsOptions = useCallback(
    async (
      search?: string
    ): Promise<
      Array<{ value: string; label: string; image?: string; key: string }>
    > => {
      try {
        const res = await cryptoService.listCoins({
          current: 1,
          pageSize: 20,
          query: search,
        })
        const coins = res?.body?.items || []
        return coins.map((coin) => ({
          key: coin.id,
          value: coin.coin,
          label: `${coin.coin} - ${coin.name}`,
          image: coin.image,
        }))
      } catch (error) {
        console.error('Failed to fetch coins:', error)
        toast.error('Failed to load coins. Please try again.')
        return []
      }
    },
    []
  )

  const defaultValues = useMemo<Partial<StakeAssetForm>>(() => {
    if (data) {
      return {
        asset: data.asset || '',
        image: data.image || '',
        maxSize: data.maxSize,
        status: (data.status as 'active' | 'inactive') || 'active',
        termsAndConditions: data.termsAndConditions || '',
        stakeAssetTitle: data.stakeAssetTitle || '',
        stakeImage: data.stakeImage || '',
      }
    }
    return {
      asset: '',
      image: '',
      maxSize: undefined,
      status: 'active',
      termsAndConditions: '',
      stakeAssetTitle: '',
      stakeImage: '',
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (values: StakeAssetForm) => {
      if (!values.image) {
        throw new Error('Asset image is required. Please select an asset.')
      }

      if (isEdit && data) {
        const apiParams: StakeAssetUpdateParams = {
          asset: values.asset,
          image: values.image,
          maxSize: values.maxSize,
          status: values.status,
          termsAndConditions: values.termsAndConditions,
          stakeAssetTitle: values.stakeAssetTitle,
          stakeImage: values.stakeImage,
        }
        return await stakeService.updateStakeAsset(data.asset, apiParams)
      } else {
        const apiParams: StakeAssetCreateParams = {
          asset: values.asset,
          image: values.image,
          maxSize: values.maxSize,
          status: values.status,
          termsAndConditions: values.termsAndConditions,
          stakeAssetTitle: values.stakeAssetTitle,
          stakeImage: values.stakeImage,
        }
        return await stakeService.createStakeAsset(apiParams)
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit
          ? 'Stake asset updated successfully!'
          : 'Stake asset created successfully!'
      )
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STAKE_ASSET_LIST],
        exact: false,
      })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save stake asset')
    },
  })

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const response = await stakeService.uploadStakeAssetImage(file)
      if (
        response.body &&
        typeof response.body === 'object' &&
        'imageUrl' in response.body
      ) {
        const imageUrl = (response.body as { imageUrl: string }).imageUrl
        if (!imageUrl) {
          throw new Error('Image URL is empty')
        }
        return imageUrl
      }
      throw new Error('Failed to get image URL from response')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload image'
      toast.error(errorMessage)
      throw error
    }
  }, [])

  const fieldsWithUpload = useMemo<FormFieldConfig<StakeAssetForm>[]>(() => {
    return STAKE_ASSET_FORM_FIELDS.map((field) => {
      if (field.name === 'asset') {
        return {
          ...field,
          comboboxOptions: {
            fetchOptions: fetchCoinsOptions,
            placeholder: 'Search coins...',
            onSelect: (
              _value: string,
              image: string | undefined,
              form: any
            ) => {
              // Set asset image from selected coin
              if (image) {
                form.setValue('image', image)
              }
            },
          },
        }
      }
      if (field.name === 'stakeImage' && field.type === 'image-upload') {
        return {
          ...field,
          onImageUpload: handleImageUpload,
        }
      }
      return field
    })
  }, [fetchCoinsOptions, handleImageUpload])

  const handleSubmit = async (values: StakeAssetForm): Promise<void> => {
    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      throw error
    }
  }

  return (
    <ConfigFormDialog<StakeAssetForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<StakeAssetForm>) : undefined}
      schema={stakeAssetFormSchema}
      fields={fieldsWithUpload}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Stake Asset' : 'Create Stake Asset'}
      description={
        isEdit
          ? 'Update the stake asset here.'
          : 'Create a new stake asset here.'
      }
      submitButtonText={isEdit ? 'Update' : 'Create'}
      isSubmitting={mutation.isPending}
      defaultValues={defaultValues}
    />
  )
}

export const StakeAssetDialogs = {
  StakeAssetForm: StakeAssetFormDialog,
}
