import { z } from 'zod'

export const loanStatusFormSchema = z.object({
  status: z.string().min(1, 'Status is required.'),
  description: z.string().min(1, 'Description is required.'),
})

export type LoanStatusForm = z.infer<typeof loanStatusFormSchema>
