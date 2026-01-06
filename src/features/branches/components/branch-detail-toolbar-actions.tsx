import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { LoanStatus } from '@/services'
import { loanStatusService } from '@/services'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { FilterField } from '@/components/filter-panel'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { LOAN_TABLE_CONFIG } from './constants'

const FILTER_KEYS = [
  'statusId',
  'loanId',
  'registerNumber',
  'phoneNumber',
  'loanAmount',
  'loanAmount_operator',
  'closePayAmount',
  'closePayAmount_operator',
  'payAmount',
  'payAmount_operator',
  'payInterest',
  'payInterest_operator',
  'overdueDay',
  'overdueDay_operator',
] as const

const BRANCH_LOAN_FILTER_FIELDS: FilterField[] = [
  {
    key: 'loanId',
    label: 'Зээлийн ID',
    type: 'text',
    placeholder: 'Зээлийн ID-аар хайх...',
  },
  {
    key: 'registerNumber',
    label: 'Регистр',
    type: 'text',
    placeholder: 'Регистрийн дугаар...',
  },
  {
    key: 'phoneNumber',
    label: 'Утас',
    type: 'text',
    placeholder: 'Утасны дугаар...',
  },
  {
    key: 'statusId',
    label: 'Төлөв',
    type: 'select',
    placeholder: 'Төлөв сонгох...',
    options: [],
  },
  {
    key: 'loanAmount',
    label: 'Олгосон зээл',
    type: 'number-comparison',
    placeholder: 'Дүн оруулах...',
  },
  {
    key: 'closePayAmount',
    label: 'Хаах дүн',
    type: 'number-comparison',
    placeholder: 'Дүн оруулах...',
  },
  {
    key: 'payAmount',
    label: 'Төлөх дүн',
    type: 'number-comparison',
    placeholder: 'Дүн оруулах...',
  },
  {
    key: 'payInterest',
    label: 'Хүү',
    type: 'number-comparison',
    placeholder: 'Хүү оруулах...',
  },
  {
    key: 'overdueDay',
    label: 'Хэтэрсэн хоног',
    type: 'number-comparison',
    placeholder: 'Хоног оруулах...',
  },
  {
    key: 'dateRange',
    label: 'Огнооны хүрээ',
    type: 'date-range',
    placeholder: 'Огноогоор шүүх',
  },
]

type BranchDetailToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function BranchDetailToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: BranchDetailToolbarActionsProps) {
  // Fetch loan statuses for filter options
  const { data: loanStatuses } = useQuery({
    queryKey: ['loan-statuses'],
    queryFn: async () => {
      try {
        const res = await loanStatusService.listLoanStatuses({
          pageSize: 100,
        })
        return res?.body?.list || []
      } catch (error) {
        console.error('Failed to fetch loan statuses:', error)
        return []
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 1,
  })

  // Build filter fields with dynamic options
  const filterFields = useMemo(() => {
    return BRANCH_LOAN_FILTER_FIELDS.map((field) => {
      if (field.key === 'statusId' && loanStatuses) {
        return {
          ...field,
          options: loanStatuses.map((status: LoanStatus) => ({
            label: status.description,
            value: String(status.id),
          })),
        }
      }
      return field
    })
  }, [loanStatuses])

  return (
    <FilterToolbarActions
      fields={filterFields}
      search={{
        loanId: typeof search.loanId === 'string' ? search.loanId : undefined,
        registerNumber:
          typeof search.registerNumber === 'string'
            ? search.registerNumber
            : undefined,
        phoneNumber:
          typeof search.phoneNumber === 'string'
            ? search.phoneNumber
            : undefined,
        statusId:
          typeof search.statusId === 'string' ? search.statusId : undefined,
        loanAmount:
          typeof search.loanAmount === 'string' ? search.loanAmount : undefined,
        loanAmount_operator:
          typeof search.loanAmount_operator === 'string'
            ? search.loanAmount_operator
            : undefined,
        closePayAmount:
          typeof search.closePayAmount === 'string'
            ? search.closePayAmount
            : undefined,
        closePayAmount_operator:
          typeof search.closePayAmount_operator === 'string'
            ? search.closePayAmount_operator
            : undefined,
        payAmount:
          typeof search.payAmount === 'string' ? search.payAmount : undefined,
        payAmount_operator:
          typeof search.payAmount_operator === 'string'
            ? search.payAmount_operator
            : undefined,
        payInterest:
          typeof search.payInterest === 'string'
            ? search.payInterest
            : undefined,
        payInterest_operator:
          typeof search.payInterest_operator === 'string'
            ? search.payInterest_operator
            : undefined,
        overdueDay:
          typeof search.overdueDay === 'string' ? search.overdueDay : undefined,
        overdueDay_operator:
          typeof search.overdueDay_operator === 'string'
            ? search.overdueDay_operator
            : undefined,
        start_day:
          typeof search.start_day === 'string' ? search.start_day : undefined,
        end_day:
          typeof search.end_day === 'string' ? search.end_day : undefined,
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={LOAN_TABLE_CONFIG.ID}
      exportFileName={LOAN_TABLE_CONFIG.EXPORT_FILE_NAME}
    />
  )
}
