import { createFileRoute } from '@tanstack/react-router'
import { LoanImport } from '@/features/loans/import'

export const Route = createFileRoute('/_authenticated/loans/import')({
  component: LoanImport,
})
