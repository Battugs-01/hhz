import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'

const otpSearchSchema = z.object({
  session: z.string().optional(),
  username: z.string().optional(),
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/otp')({
  validateSearch: otpSearchSchema,
  component: Otp,
})
