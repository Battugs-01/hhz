import { z } from 'zod'

export const loanUpdateFormSchema = z
  .object({
    status: z.string().min(1, 'Төлөв сонгоно уу.'),
    // Location fields
    location: z.string().optional(),
    currentLocation: z.string().optional(),
    workLocation: z.string().optional(),
    additionalLocation: z.string().optional(),
    // Judge info fields (only required when status === "3")
    district: z.number().optional(),
    judge: z.string().optional(),
    assistant: z.string().optional(),
    assistantPhoneNumber: z.string().optional(),
    invoiceNumber: z.string().optional(),
    code: z.string().optional(),
    invoiceDate: z.string().optional(),
    ordinanceAmount: z.number().optional(),
    ordinance: z.string().optional(),
    refundStampFeeAmount: z.number().optional(),
    stampFeeAmount: z.number().optional(),
    responsibleEmployee: z.string().optional(),
    requestedActionPage: z.string().optional(),
    closedStatus: z.number().optional(),
    description: z.string().optional(),
    invoicedDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If status is "3" (Шүүх дээр шилжүүлэх), judge info fields are required
    if (data.status === '3') {
      if (!data.district || data.district === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Дүүрэг сонгоно уу.',
          path: ['district'],
        })
      }
      if (!data.judge?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Шүүгчийн нэрийг оруулна уу.',
          path: ['judge'],
        })
      }
      if (!data.assistant?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Шүүгчийн туслахын нэрийг оруулна уу.',
          path: ['assistant'],
        })
      }
      if (!data.assistantPhoneNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Туслахын утасны дугаарыг оруулна уу.',
          path: ['assistantPhoneNumber'],
        })
      }
      if (!data.code?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Кодоо оруулна уу.',
          path: ['code'],
        })
      }
      if (!data.invoiceNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Нэхэмжлэхийн дугаараа оруулна уу.',
          path: ['invoiceNumber'],
        })
      }
    }
  })

export type LoanUpdateForm = z.infer<typeof loanUpdateFormSchema>
