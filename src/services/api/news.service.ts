import { z } from 'zod'
import type {
  NewsCreateParams,
  NewsListRequest,
  NewsListResponse,
  NewsResponse,
  NewsUpdateParams,
} from '../types/news.types'
import {
  newsApiResponseSchema,
  transformNewsApiResponse,
} from '../types/news.types'
import { newsApiClient } from './client'

export const newsService = {
  listNews: async (body: NewsListRequest = {}): Promise<NewsListResponse> => {
    const apiBody: Record<string, unknown> = {
      name_mn: body.nameMon,
      name_en: body.nameEng,
      status: body.status,
    }

    if (body.category) {
      apiBody.category =
        body.category.toLowerCase() === 'announcement' ? 'announcement' : 'news'
    }

    if (body.lastEvaluatedKey !== undefined && body.lastEvaluatedKey !== null) {
      apiBody.lastEvaluatedKey =
        typeof body.lastEvaluatedKey === 'string'
          ? body.lastEvaluatedKey
          : JSON.stringify(body.lastEvaluatedKey)
    }

    const response = await newsApiClient.post<{
      code: number
      msg: string
      data: {
        list: z.infer<typeof newsApiResponseSchema>[]
        total?: number
        lastEvaluatedKey?: string | Record<string, unknown>
      } | null
    }>('/news/list', apiBody)

    if (response.data.data?.list) {
      const transformedItems = response.data.data.list
        .map((item) => {
          try {
            const parsed = newsApiResponseSchema.parse(item)
            return transformNewsApiResponse(parsed)
          } catch (error) {
            console.error('Failed to parse news item:', item, error)
            return null
          }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)

      return {
        message: response.data.msg || 'success',
        body: {
          items: transformedItems,
          total: response.data.data.total || transformedItems.length,
          lastEvaluatedKey: response.data.data.lastEvaluatedKey,
        },
      }
    }

    return {
      message: response.data.msg || 'success',
      body: {
        items: [],
        total: 0,
        lastEvaluatedKey: undefined,
      },
    }
  },

  getNewsById: async (id: string): Promise<NewsResponse> => {
    const response = await newsApiClient.get<{
      code: number
      msg: string
      data: z.infer<typeof newsApiResponseSchema> | null
    }>(`/news/${id}`)

    if (response.data.data) {
      const transformed = transformNewsApiResponse(
        newsApiResponseSchema.parse(response.data.data)
      )

      return {
        message: response.data.msg || 'success',
        body: transformed,
      }
    }

    return {
      message: response.data.msg || 'success',
      body: null,
    }
  },

  createNews: async (params: NewsCreateParams): Promise<NewsResponse> => {
    const response = await newsApiClient.post<{
      code: number
      msg: string
      data: z.infer<typeof newsApiResponseSchema> | null
    }>('/news', params)

    if (response.data.data) {
      const transformed = transformNewsApiResponse(
        newsApiResponseSchema.parse(response.data.data)
      )

      return {
        message: response.data.msg || 'success',
        body: transformed,
      }
    }

    return {
      message: response.data.msg || 'success',
      body: null,
    }
  },

  updateNews: async (
    id: string,
    params: NewsUpdateParams
  ): Promise<NewsResponse> => {
    const response = await newsApiClient.put<{
      code: number
      msg: string
      data: z.infer<typeof newsApiResponseSchema> | null
    }>(`/news/${id}`, params)

    if (response.data.data) {
      const transformed = transformNewsApiResponse(
        newsApiResponseSchema.parse(response.data.data)
      )

      return {
        message: response.data.msg || 'success',
        body: transformed,
      }
    }

    return {
      message: response.data.msg || 'success',
      body: null,
    }
  },

  deleteNews: async (id: string): Promise<void> => {
    await newsApiClient.delete(`/news/${id}`)
  },

  uploadNewsImage: async (
    file: File,
    newsId?: string
  ): Promise<{ message: string; body: { newsImageUrl: string } | null }> => {
    const formData = new FormData()
    formData.append('image', file)
    if (newsId) {
      formData.append('newsId', newsId)
    }

    const response = await newsApiClient.post<{
      data: { newsImageUrl: string; message?: string }
      msg: string
      code: number
    }>('/news/image-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return {
      message: response.data.msg || response.data.data?.message || 'Success',
      body: response.data.data || null,
    }
  },
}
