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
    () => {
      const result: any = {
        ...params,
        districtId: Number(districtId),
      }
      
      // Convert sortDate field names from start_day/end_day to startDate/endDate
      if (result.sortDate) {
        result.sortDate = {
          startDate: result.sortDate.start_day,
          endDate: result.sortDate.end_day,
        }
      }
      
      return result
    },
    [params, districtId, search.closeStatusId]
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
