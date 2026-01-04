import { z } from 'zod'

export const economistFormSchema = z.object({
  name: z.string().min(1, 'Нэр заавал оруулна уу.'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type EconomistForm = z.infer<typeof economistFormSchema>
