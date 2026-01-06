import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { StatCard } from '@/components/ui/stat-card'
import { useDrawer } from '@/context/drawer-provider'
import { LoanDialogs } from '@/features/loans/list/components/dialogs'
import { useFilterParams } from '@/hooks/use-filter-params'
import { formatCurrency } from '@/lib/format-utils'
import { loanService, type JudgeLoan } from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { AlertCircle, Banknote, Calendar, CheckCircle2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { createJudgeLoanColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { JudgeLoanDetailContent } from './components/judge-loan-detail'
import { JudgeLoanToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/district/$districtId')

const JudgeLoanUpdateWrapper = (props: {
  open: boolean
  onClose: () => void
  data?: JudgeLoan
}) => {
  const { data, ...rest } = props
  return (
    <LoanDialogs.Update
      data={data?.loan ?? null}
      judgeLoanId={data?.id}
      judgeLoan={data}
      {...rest}
    />
  )
}

export function DistrictLoansPage() {
  const { districtId } = route.useParams()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleLoanClick = useCallback((record: JudgeLoan) => {
    openDrawer({
      title: 'Шүүхийн зээлийн дэлгэрэнгүй',
      description: `Зээлийн ID: ${record.loan.loanId} | Код: ${record.code}`,
      content: <JudgeLoanDetailContent record={record} />,
    })
  }, [openDrawer])

  const columns = useMemo(
    () => createJudgeLoanColumns({ onLoanClick: handleLoanClick }),
    [handleLoanClick]
  )

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const listParams = useMemo(
    () => ({
      ...params,
      districtId: Number(districtId),
      closeStatusId: search.closeStatusId
        ? Number(search.closeStatusId)
        : undefined,
      loanId: search.loanId,
      registerNumber: search.registerNumber,
      phoneNumber: search.phoneNumber,
      judge: search.judge,
      judgeAssistant: search.judgeAssistant,
      judgeAssistantPhoneNumber: search.judgeAssistantPhoneNumber,
      code: search.code,
      invoiceNumber: search.invoiceNumber,
      requestedActionPage: search.requestedActionPage,
      responsibleEmployee: search.responsibleEmployee,
      loanAmount: search.loanAmount,
      loanAmount_operator: search.loanAmount_operator,
      closePayAmount: search.closePayAmount,
      closePayAmount_operator: search.closePayAmount_operator,
      payAmount: search.payAmount,
      payAmount_operator: search.payAmount_operator,
      payInterest: search.payInterest,
      payInterest_operator: search.payInterest_operator,
      overdueDay: search.overdueDay,
      overdueDay_operator: search.overdueDay_operator,
      ordinanceAmount: search.ordinanceAmount
        ? Number(search.ordinanceAmount)
        : undefined,
      ordinanceAmount_operator: search.ordinanceAmount_operator,
      stampFeeAmount: search.stampFeeAmount
        ? Number(search.stampFeeAmount)
        : undefined,
      stampFeeAmount_operator: search.stampFeeAmount_operator,
      refundStampFeeAmount: search.refundStampFeeAmount
        ? Number(search.refundStampFeeAmount)
        : undefined,
      refundStampFeeAmount_operator: search.refundStampFeeAmount_operator,
      sortDate:
        search.start_day || search.end_day
          ? {
              startDate: search.start_day ? String(search.start_day) : undefined,
              endDate: search.end_day ? String(search.end_day) : undefined,
            }
          : undefined,
      query: search.query,
    }),
    [
      params,
      districtId,
      search.closeStatusId,
      search.loanId,
      search.registerNumber,
      search.phoneNumber,
      search.judge,
      search.judgeAssistant,
      search.judgeAssistantPhoneNumber,
      search.code,
      search.invoiceNumber,
      search.requestedActionPage,
      search.responsibleEmployee,
      search.loanAmount,
      search.loanAmount_operator,
      search.closePayAmount,
      search.closePayAmount_operator,
      search.payAmount,
      search.payAmount_operator,
      search.payInterest,
      search.payInterest_operator,
      search.overdueDay,
      search.overdueDay_operator,
      search.ordinanceAmount,
      search.ordinanceAmount_operator,
      search.stampFeeAmount,
      search.stampFeeAmount_operator,
      search.refundStampFeeAmount,
      search.refundStampFeeAmount_operator,
      search.start_day,
      search.end_day,
      search.query,
    ]
  )

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.JUDGE_LOAN_LIST, listParams, search.statusId],
    queryFn: async () => {
      try {
        const res = await loanService.listJudgeLoans({
          ...listParams,
          closeStatusId:
            listParams.closeStatusId ||
            (search.statusId ? Number(search.statusId) : undefined),
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (_error) {
        return { items: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 30000,
  })

  // Fetch judge dashboard summary
  const summaryParams = useMemo(() => {
    const { current, pageSize, ...rest } = listParams
    return rest
  }, [listParams])

  const { data: dashboardData, isLoading: isDashboardLoading, refetch: refetchDashboard } = useQuery({
    queryKey: ['judge-dashboard', summaryParams, search.statusId],
    queryFn: async () => {
      try {
        const res = await loanService.getJudgeDashboard({
          ...summaryParams,
          closeStatusId:
            summaryParams.closeStatusId ||
            (search.statusId ? Number(search.statusId) : undefined),
        })
        return res?.data || null
      } catch (_error) {
        return null
      }
    },
    staleTime: 30000,
  })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <JudgeLoanToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={() => {
            refetch()
            refetchDashboard()
          }}
        />
      ),
    }),
    [search, navigate, refetch, refetchDashboard, handleDateRangeChange]
  )

  const currentStatusId = search.closeStatusId || search.statusId
  const title = currentStatusId === '1' ? 'Шүүх дээр' : 'Шүүхийн шийдвэр'


  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        <StatCard
          icon={Banknote}
          label='Нийт шүүхийн зээл'
          value={dashboardData?.totalJudgeLoans ?? 0}
          isLoading={isDashboardLoading}
        />
        <StatCard
          icon={Calendar}
          label='Шүүх дээр'
          value={dashboardData?.activeJudge ?? 0}
          iconBgClass='bg-orange-500/10'
          iconClass='text-orange-500'
          isLoading={isDashboardLoading}
        />
        <StatCard
          icon={CheckCircle2}
          label='Дундаж хэтрэлт'
          value={`${dashboardData?.averageOverdueDay ?? 0} хоног`}
          iconBgClass='bg-green-500/10'
          iconClass='text-green-500'
          isLoading={isDashboardLoading}
        />
        <StatCard
          icon={AlertCircle}
          label='Нийт дүн'
          value={formatCurrency(dashboardData?.totalAmount ?? 0)}
          iconBgClass='bg-blue-500/10'
          iconClass='text-blue-500'
          isLoading={isDashboardLoading}
          skeletonWidth='w-24'
        />
      </div>

      <BaseTable
        data={data?.items ?? []}
        total={data?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoading}
        tableConfig={{
          pagination: {
            defaultPage: TABLE_CONFIG.DEFAULT_PAGE,
            defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
          },
          globalFilter: { enabled: false },
          columnFilters: [
            {
              columnId: TABLE_CONFIG.SEARCH_KEY,
              searchKey: TABLE_CONFIG.SEARCH_KEY,
              type: 'string',
            },
          ],
        }}
        header={
          <TableHeader
            title={title}
            description={`Дүүрэг ${districtId} - ${title} зээлийн жагсаалт (Нийт: ${data?.total || 0})`}
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        rowKey='id'
        UpdateComponent={JudgeLoanUpdateWrapper}
      />
    </Main>
  )
}
