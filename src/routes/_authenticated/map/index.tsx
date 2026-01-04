import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { MapPage } from '@/features/map'

const mapSearchSchema = z.object({
  worker: z.string().optional(),
  branch: z.string().optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/map/')({
  validateSearch: mapSearchSchema,
  component: MapPage,
})
