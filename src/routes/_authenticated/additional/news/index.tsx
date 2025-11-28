import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { News } from '@/features/additional/news'

export const newsSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  lastEvaluatedKey: z
    .union([z.string(), z.record(z.string(), z.unknown())])
    .optional(),
  nameMon: z.string().optional(),
  nameEng: z.string().optional(),
  category: z.enum(['news', 'announcement']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type NewsSearch = z.infer<typeof newsSearchSchema>

export const Route = createFileRoute('/_authenticated/additional/news/')({
  validateSearch: newsSearchSchema,
  component: News,
})
