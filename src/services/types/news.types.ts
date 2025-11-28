import { z } from 'zod'
import type { BaseResponse } from './common.types'

// API Response Schema (raw format from backend)
export const newsApiResponseSchema = z.object({
  id: z.string(),
  name_mn: z.string(),
  name_en: z.string(),
  short_mn: z.string().optional(),
  short_en: z.string().optional(),
  description_mn: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val.join('') : val)),
  description_en: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val.join('') : val)),
  category: z.string(), // "news" or "announcement" (lowercase)
  img: z.string().optional(),
  status: z.string(), // "active" or other
  postDate: z.string().optional(),
  createdDate: z.string(),
  updatedAt: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      typeof val === 'number' ? new Date(val).toISOString() : val
    ),
  tags: z.string().optional(),
  like: z.number().optional(),
  views: z.number().optional(),
})

// Frontend News Schema (transformed format)
export const newsSchema = z.object({
  id: z.string(),
  nameMon: z.string(),
  nameEng: z.string(),
  shortMon: z.string().optional(),
  shortEng: z.string().optional(),
  descriptionMon: z.string(),
  descriptionEng: z.string(),
  category: z.enum(['News', 'Announcement']),
  imageUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('inactive'),
  publishedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  tags: z.string().optional(),
  like: z.number().optional(),
  views: z.number().optional(),
})

export const newsListSchema = z.object({
  items: z.array(newsSchema),
  total: z.number(),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional(),
})

export type News = z.infer<typeof newsSchema>
export type NewsList = z.infer<typeof newsListSchema>

export interface NewsListRequest {
  page?: number
  pageSize?: number
  lastEvaluatedKey?: string | Record<string, unknown>
  nameMon?: string
  nameEng?: string
  category?: 'news' | 'announcement' // lowercase to match URL search params
  status?: 'active' | 'inactive'
  start_day?: string
  end_day?: string
}

export interface NewsListResponse extends BaseResponse<NewsList> {}

export interface NewsResponse extends BaseResponse<News> {}

export interface NewsCreateParams {
  name_mn: string
  name_en: string
  short_mn?: string
  short_en?: string
  description_mn: string
  description_en: string
  category: string // "news" or "announcement" (lowercase)
  img?: string
  status?: string // "active" or "inactive"
  postDate?: string
}

export interface NewsUpdateParams {
  name_mn?: string
  name_en?: string
  short_mn?: string
  short_en?: string
  description_mn?: string
  description_en?: string
  category?: string // "news" or "announcement" (lowercase)
  img?: string
  status?: string // "active" or "inactive"
  postDate?: string
}

// Helper function to transform API response to frontend format
export function transformNewsApiResponse(
  apiData: z.infer<typeof newsApiResponseSchema>
): z.infer<typeof newsSchema> {
  const categoryMap: Record<string, 'News' | 'Announcement'> = {
    news: 'News',
    announcement: 'Announcement',
  }

  return {
    id: apiData.id,
    nameMon: apiData.name_mn,
    nameEng: apiData.name_en,
    shortMon: apiData.short_mn,
    shortEng: apiData.short_en,
    descriptionMon: apiData.description_mn,
    descriptionEng: apiData.description_en,
    category: categoryMap[apiData.category.toLowerCase()] || 'News',
    imageUrl: apiData.img,
    status: (apiData.status === 'active' ? 'active' : 'inactive') as
      | 'active'
      | 'inactive',
    publishedAt: apiData.postDate,
    createdAt: apiData.createdDate,
    updatedAt: apiData.updatedAt || apiData.createdDate, // Use updatedAt if available, otherwise createdDate
    tags: apiData.tags,
    like: apiData.like,
    views: apiData.views,
  }
}

// Helper function to transform frontend format to API request format
export function transformNewsToApiRequest(
  frontendData: Partial<z.infer<typeof newsSchema>>
): Partial<NewsCreateParams> {
  const categoryMap: Record<'News' | 'Announcement', string> = {
    News: 'news',
    Announcement: 'announcement',
  }

  const params: Partial<NewsCreateParams> = {}

  if (frontendData.nameMon !== undefined) params.name_mn = frontendData.nameMon
  if (frontendData.nameEng !== undefined) params.name_en = frontendData.nameEng
  if (frontendData.shortMon !== undefined)
    params.short_mn = frontendData.shortMon
  if (frontendData.shortEng !== undefined)
    params.short_en = frontendData.shortEng
  if (frontendData.descriptionMon !== undefined)
    params.description_mn = frontendData.descriptionMon
  if (frontendData.descriptionEng !== undefined)
    params.description_en = frontendData.descriptionEng
  if (frontendData.category !== undefined)
    params.category = categoryMap[frontendData.category] || 'news'
  if (frontendData.imageUrl !== undefined) params.img = frontendData.imageUrl
  if (frontendData.status !== undefined) params.status = frontendData.status
  if (frontendData.publishedAt !== undefined)
    params.postDate = frontendData.publishedAt

  return params
}
