import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { judgeCloseStatusService } from '@/services/api/judge-close-status.service'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  FILTER_KEYS,
  JUDGE_LOAN_FILTER_FIELDS,
  TABLE_CONFIG,
} from './constants'

type JudgeLoanToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function JudgeLoanToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: JudgeLoanToolbarActionsProps) {
  // Fetch judge close statuses for filter options
  const { data: closeStatuses } = useQuery({
    queryKey: ['judge-close-statuses'],
    queryFn: async () => {
      try {
        const res = await judgeCloseStatusService.listJudgeCloseStatuses({
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (_error) {
        return []
      }
    },
    staleTime: 300000,
    retry: 1,
  })

  // Build filter fields with dynamic options
  const filterFields = useMemo(() => {
    return JUDGE_LOAN_FILTER_FIELDS.map((field) => {
      if (field.key === 'closeStatusId' && closeStatuses) {
        return {
          ...field,
          options: closeStatuses.map((status) => ({
            label: status.status,
            value: String(status.id),
          })),
        }
      }
      return field
    })
  }, [closeStatuses])

  return (
    <FilterToolbarActions
      fields={filterFields}
      search={{
        closeStatusId: String(search.closeStatusId || ''),
        loanId: String(search.loanId || ''),
        registerNumber: String(search.registerNumber || ''),
        phoneNumber: String(search.phoneNumber || ''),
        judge: String(search.judge || ''),
        judgeAssistant: String(search.judgeAssistant || ''),
        judgeAssistantPhoneNumber: String(search.judgeAssistantPhoneNumber || ''),
        code: String(search.code || ''),
        invoiceNumber: String(search.invoiceNumber || ''),
        requestedActionPage: String(search.requestedActionPage || ''),
        responsibleEmployee: String(search.responsibleEmployee || ''),
        loanAmount: String(search.loanAmount || ''),
        loanAmount_operator: String(search.loanAmount_operator || ''),
        closePayAmount: String(search.closePayAmount || ''),
        closePayAmount_operator: String(search.closePayAmount_operator || ''),
        payAmount: String(search.payAmount || ''),
        payAmount_operator: String(search.payAmount_operator || ''),
        payInterest: String(search.payInterest || ''),
        payInterest_operator: String(search.payInterest_operator || ''),
        overdueDay: String(search.overdueDay || ''),
        overdueDay_operator: String(search.overdueDay_operator || ''),
        ordinanceAmount: String(search.ordinanceAmount || ''),
        ordinanceAmount_operator: String(search.ordinanceAmount_operator || ''),
        stampFeeAmount: String(search.stampFeeAmount || ''),
        stampFeeAmount_operator: String(search.stampFeeAmount_operator || ''),
        refundStampFeeAmount: String(search.refundStampFeeAmount || ''),
        refundStampFeeAmount_operator: String(
          search.refundStampFeeAmount_operator || ''
        ),
        start_day: String(search.start_day || ''),
        end_day: String(search.end_day || ''),
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={TABLE_CONFIG.ID}
      exportFileName='judge-loans.xlsx'
    />
  )
}
