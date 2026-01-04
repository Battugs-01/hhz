import { z } from 'zod'
import { adminRoleSchema } from '@/services/types/admin.types'

export const adminFormSchema = z
  .object({
    firstName: z.string().min(1, 'Нэр заавал оруулна уу.'),
    lastName: z.string().min(1, 'Овог заавал оруулна уу.'),
    email: z.string().email('Зөв и-мэйл хаяг оруулна уу.'),
    role: adminRoleSchema,
    password: z
      .string()
      .optional()
      .transform((pwd) => pwd?.trim() || ''),
    confirmPassword: z
      .string()
      .optional()
      .transform((pwd) => pwd?.trim() || ''),
    isEdit: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Skip password validation in edit mode
      if (data.isEdit) return true
      // In create mode, password is required
      return (data.password?.length || 0) > 0
    },
    { message: 'Нууц үг заавал оруулна уу.', path: ['password'] }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit) return true
      return (password?.length || 0) >= 8
    },
    {
      message: 'Нууц үг 8-аас дээш тэмдэгттэй байх ёстой.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit) return true
      return /[a-z]/.test(password || '')
    },
    {
      message: 'Нууц үг жижиг үсэг агуулсан байх ёстой.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit) return true
      return /[A-Z]/.test(password || '')
    },
    {
      message: 'Нууц үг том үсэг агуулсан байх ёстой.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit) return true
      return /\d/.test(password || '')
    },
    {
      message: 'Нууц үг тоо агуулсан байх ёстой.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit) return true
      return password === confirmPassword
    },
    { message: 'Нууц үг таарахгүй байна.', path: ['confirmPassword'] }
  )

export type AdminForm = z.infer<typeof adminFormSchema>
