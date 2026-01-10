import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import {
  branchService,
  economistService,
  loanService,
  loanStatusService,
} from '@/services'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import 'leaflet/dist/leaflet.css'
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Filter,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import { useMemo } from 'react'
import {
  FILTER_KEYS,
  LOAN_FILTER_FIELDS,
  TABLE_CONFIG,
} from '../loans/list/components/constants'
import { MapContainer } from './components/map-container'

const route = getRouteApi('/_authenticated/map/')

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('MNT', '₮')
}

export function MapPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch all loans with current filters
  const {
    data: loansData,
    isLoading,
    refetch: refetchLoans,
  } = useQuery({
    queryKey: ['map-loans', search],
    queryFn: async () => {
      try {
        const params: any = { ...search }
        if (params.branchId) params.branchId = Number(params.branchId)
        if (params.economistId) params.economistId = Number(params.economistId)
        if (params.statusId) params.statusId = Number(params.statusId)

        const res = await loanService.listLoans({
          current: 1,
          pageSize: 10000, // Get all matching loans for map
          ...params,
        })
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch loans:', error)
        return { items: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 60000,
  })

  // Fetch summary statistics with current filters
  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['map-summary', search],
    queryFn: async () => {
      try {
        const params: any = { ...search }
        if (params.branchId) params.branchId = Number(params.branchId)
        if (params.economistId) params.economistId = Number(params.economistId)
        if (params.statusId && !isNaN(Number(params.statusId))) {
          params.statusId = Number(params.statusId)
        }
        
        const res = await loanService.getSummary(params as any)
        return res?.data || null
      } catch (error) {
        console.error('Failed to fetch summary:', error)
        return null
      }
    },
    retry: 1,
    staleTime: 60000,
  })

  // Fetch branches for filter options
  const { data: branches } = useQuery({
    queryKey: ['branches-for-filter'],
    queryFn: async () => {
      const res = await branchService.listBranches({ current: 1, pageSize: 100 })
      return res?.body?.list || []
    },
    staleTime: 300000,
  })

  // Fetch economists for filter options
  const { data: economists } = useQuery({
    queryKey: ['economists-for-filter'],
    queryFn: async () => {
      const res = await economistService.listEconomists({
        current: 1,
        pageSize: 100,
      })
      return res?.body?.list || []
    },
    staleTime: 300000,
  })

  // Fetch loan statuses for filter options
  const { data: loanStatuses } = useQuery({
    queryKey: ['loan-statuses'],
    queryFn: async () => {
      const res = await loanStatusService.listLoanStatuses({ pageSize: 100 })
      return res?.body?.list || []
    },
    staleTime: 300000,
  })

  // Fetch worker GPS locations
  const { data: gpsLocs } = useQuery({
    queryKey: ['gps-locations'],
    queryFn: () => loanService.getGpsLocations(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Build filter fields with dynamic options
  const filterFields = useMemo(() => {
    const fields = [
      {
        key: 'economistId',
        label: 'Эдийн засагч',
        type: 'select' as const,
        placeholder: 'Эдийн засагч сонгох...',
      },
      ...LOAN_FILTER_FIELDS,
    ]

    return fields.map((field) => {
      if (field.key === 'branchId' && branches) {
        return {
          ...field,
          options: branches.map((b) => ({ label: b.branch, value: String(b.id) })),
        }
      }
      if (field.key === 'statusId' && loanStatuses) {
        return {
          ...field,
          options: loanStatuses.map((s) => ({
            label: s.description,
            value: String(s.id),
          })),
        }
      }
      if (field.key === 'economistId' && economists) {
        return {
          ...field,
          options: economists.map((e) => ({
            label: e.name,
            value: String(e.id),
          })),
        }
      }
      return field
    })
  }, [branches, loanStatuses, economists])

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Газрын зураг</h1>
          <p className='text-muted-foreground'>
            Зээлийн байршил, төлвийн газарзүйн харагдац
          </p>
        </div>
        <Button onClick={() => refetchLoans()} variant='outline' size='sm'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Шинэчлэх
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        <StatCard
          icon={MapPin}
          label='Нийт зээл'
          value={summary?.totalLoans ?? 0}
          isLoading={isSummaryLoading}
        />
        <StatCard
          icon={AlertTriangle}
          label='Хэтэрсэн'
          value={summary?.overdueLoans ?? 0}
          iconBgClass='bg-orange-500/10'
          iconClass='text-orange-500'
          valueClass='text-orange-500'
          isLoading={isSummaryLoading}
        />
        <StatCard
          icon={DollarSign}
          label='Нийт дүн'
          value={formatCurrency(summary?.totalLoanAmount ?? 0)}
          iconBgClass='bg-green-500/10'
          iconClass='text-green-500'
          isLoading={isSummaryLoading}
          skeletonWidth='w-24'
        />
        <StatCard
          icon={Calendar}
          label='Онцгой хэтэрсэн'
          value={summary?.severelyOverdueLoans ?? 0}
          iconBgClass='bg-red-500/10'
          iconClass='text-red-500'
          valueClass='text-red-500'
          isLoading={isSummaryLoading}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            <span>Шүүлтүүр</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FilterToolbarActions
            fields={filterFields}
            search={search}
            navigate={navigate}
            filterKeys={[...FILTER_KEYS, 'economistId']}
            onRefresh={refetchLoans}
            tableId={TABLE_CONFIG.ID}
            exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
          />
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='h-5 w-5' />
            <span>Зээлийн байршлууд</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <MapContainer 
            loans={loansData?.items || []} 
            gpsLocs={gpsLocs || []}
            isLoading={isLoading} 
            onRefresh={refetchLoans}
          />
        </CardContent>
      </Card>
    </Main>
  )
}
