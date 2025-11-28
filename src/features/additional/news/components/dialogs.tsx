import { useCallback, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { newsService, type News } from '@/services'
import { transformNewsToApiRequest } from '@/services/types/news.types'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import {
  ConfigFormDialog,
  type FormFieldConfig,
} from '@/components/ui/config-form-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { QUERY_KEYS } from './constants'
import { NEWS_FORM_FIELDS, newsFormSchema, type NewsForm } from './schemas'

function NewsFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<News>) {
  const isEdit = !!data
  const queryClient = useQueryClient()

  const defaultValues = useMemo<Partial<NewsForm>>(() => {
    if (data) {
      return {
        nameMon: data.nameMon || '',
        nameEng: data.nameEng || '',
        shortMon: data.shortMon || '',
        shortEng: data.shortEng || '',
        descriptionMon: data.descriptionMon || '',
        descriptionEng: data.descriptionEng || '',
        category: data.category || 'News',
        imageUrl: data.imageUrl || '',
        status: data.status || 'inactive',
      }
    }
    return {
      nameMon: '',
      nameEng: '',
      shortMon: '',
      shortEng: '',
      descriptionMon: '',
      descriptionEng: '',
      category: 'News',
      imageUrl: '',
      status: 'inactive',
    }
  }, [data])

  const mutation = useMutation({
    mutationFn: async (values: NewsForm) => {
      const apiParams = transformNewsToApiRequest(values)

      if (isEdit && data) {
        return await newsService.updateNews(data.id, apiParams)
      } else {
        return await newsService.createNews(apiParams as any)
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit ? 'News updated successfully!' : 'News created successfully!'
      )
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NEWS_LIST],
        exact: false,
      })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save news')
    },
  })

  const handleImageUpload = useCallback(
    async (file: File): Promise<string> => {
      try {
        const response = await newsService.uploadNewsImage(file, data?.id)
        if (
          response.body &&
          typeof response.body === 'object' &&
          'newsImageUrl' in response.body
        ) {
          const newsImageUrl = (response.body as { newsImageUrl: string })
            .newsImageUrl
          if (!newsImageUrl) {
            throw new Error('Image URL is empty')
          }
          return newsImageUrl
        }
        throw new Error('Failed to get image URL from response')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload image'
        toast.error(errorMessage)
        throw error
      }
    },
    [data?.id]
  )

  const fieldsWithUpload = useMemo<FormFieldConfig<NewsForm>[]>(() => {
    return NEWS_FORM_FIELDS.map((field) => {
      if (field.type === 'image-upload') {
        return {
          ...field,
          onImageUpload: handleImageUpload,
        }
      }
      return field
    })
  }, [handleImageUpload])

  const handleSubmit = async (values: NewsForm): Promise<void> => {
    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      throw error
    }
  }

  return (
    <ConfigFormDialog<NewsForm>
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      data={data ? (data as Partial<NewsForm>) : undefined}
      schema={newsFormSchema}
      fields={fieldsWithUpload}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit News' : 'Create News'}
      description={
        isEdit
          ? 'Update the news article here.'
          : 'Create a new news article here.'
      }
      submitButtonText={isEdit ? 'Update' : 'Create'}
      isSubmitting={mutation.isPending}
      defaultValues={defaultValues}
    />
  )
}

export const NewsDialogs = {
  NewsForm: NewsFormDialog,
}

export function NewsDeleteDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<News> & { data: News }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error('No data to delete')
      await newsService.deleteNews(data.id)
    },
    onSuccess: () => {
      toast.success('News deleted successfully!')
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NEWS_LIST] })
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete news')
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
      title='Delete News'
      desc={`Are you sure you want to delete "${data?.nameMon || data?.nameEng}"? This action cannot be undone.`}
      confirmText='Delete'
      cancelBtnText='Cancel'
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
