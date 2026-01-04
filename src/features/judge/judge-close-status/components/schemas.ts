import { z } from 'zod'

export const judgeCloseStatusFormSchema = z.object({
  status: z.string().min(1, 'Төлөв оруулна уу').max(255),
  description: z.string().min(1, 'Тайлбар оруулна уу').max(1000),
  isActive: z.boolean().default(true),
})

export type JudgeCloseStatusForm = z.infer<typeof judgeCloseStatusFormSchema>
