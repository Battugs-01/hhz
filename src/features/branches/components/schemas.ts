import { z } from 'zod'

export const branchFormSchema = z.object({
  branch: z.string().min(1, 'Branch name is required.'),
  isActive: z.boolean().default(true),
})

export type BranchForm = z.infer<typeof branchFormSchema>
