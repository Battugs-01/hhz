import { createFileRoute } from '@tanstack/react-router'
import { UpdatePassword } from '@/features/auth/update-password'

export const Route = createFileRoute('/_authenticated/update-password')({
  component: UpdatePassword,
})
