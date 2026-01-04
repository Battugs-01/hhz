import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { Loan } from '@/services'
import { loanService } from '@/services'
import 'leaflet/dist/leaflet.css'
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Filter,
  MapPin,
  RefreshCw,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatCard } from '@/components/ui/stat-card'
import { Main } from '@/components/layout/main'
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
  const [selectedWorker, setSelectedWorker] = useState(search.worker || 'all')
  const [selectedBranch, setSelectedBranch] = useState(search.branch || 'all')
  const [searchTerm, setSearchTerm] = useState(search.search || '')

  // Fetch all loans
  const {
    data: loansData,
    isLoading,
    refetch: refetchLoans,
  } = useQuery({
    queryKey: ['map-loans'],
    queryFn: async () => {
      try {
        const res = await loanService.listLoans({
          current: 1,
          pageSize: 10000, // Get all loans
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
    staleTime: 60000, // 1 minute
  })

  // Filter locations
  const filteredLocations = useMemo(() => {
    if (!loansData?.items) return []

    return loansData.items.filter((loan: Loan) => {
      // Worker filter
      const matchesWorker =
        selectedWorker === 'all' || loan.economistId === Number(selectedWorker)

      // Branch filter
      const matchesBranch =
        selectedBranch === 'all' || loan.branchId === Number(selectedBranch)

      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        loan.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.customer?.phoneNumber
          ?.toString()
          .includes(searchTerm.toLowerCase()) ||
        loan.customer?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        loan.customer?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())

      return matchesWorker && matchesBranch && matchesSearch
    })
  }, [loansData?.items, selectedWorker, selectedBranch, searchTerm])

  // Calculate statistics
  const validLocations = useMemo(() => {
    return filteredLocations.filter((loan) => {
      const hasLocation =
        loan.customer?.location && loan.customer.location.trim() !== ''
      return hasLocation
    }).length
  }, [filteredLocations])

  const totalAmount = useMemo(() => {
    return filteredLocations.reduce(
      (sum, loan) => sum + (loan.loanAmount || 0),
      0
    )
  }, [filteredLocations])

  const overdueLoans = useMemo(() => {
    return filteredLocations.filter((loan) => loan.overdueDay > 30).length
  }, [filteredLocations])

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
          value={filteredLocations.length}
          isLoading={isLoading}
        />
        <StatCard
          icon={AlertTriangle}
          label='Хаягтай зээл'
          value={validLocations}
          iconBgClass='bg-orange-500/10'
          iconClass='text-orange-500'
          valueClass='text-orange-500'
          isLoading={isLoading}
        />
        <StatCard
          icon={DollarSign}
          label='Нийт дүн'
          value={formatCurrency(totalAmount)}
          iconBgClass='bg-green-500/10'
          iconClass='text-green-500'
          isLoading={isLoading}
          skeletonWidth='w-24'
        />
        <StatCard
          icon={Calendar}
          label='Хэтэрсэн (30+)'
          value={overdueLoans}
          iconBgClass='bg-red-500/10'
          iconClass='text-red-500'
          valueClass='text-red-500'
          isLoading={isLoading}
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
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
            <div className='flex-1'>
              <label className='mb-2 block text-sm font-medium'>
                Эдийн засагч
              </label>
              <Select
                value={selectedWorker}
                onValueChange={(value) => {
                  setSelectedWorker(value)
                  navigate({ search: { ...search, worker: value } })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Бүх эдийн засагч' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Бүх эдийн засагч</SelectItem>
                  {/* TODO: Fetch and display economists */}
                </SelectContent>
              </Select>
            </div>

            <div className='flex-1'>
              <label className='mb-2 block text-sm font-medium'>Салбар</label>
              <Select
                value={selectedBranch}
                onValueChange={(value) => {
                  setSelectedBranch(value)
                  navigate({ search: { ...search, branch: value } })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Бүх салбар' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Бүх салбар</SelectItem>
                  {/* TODO: Fetch and display branches */}
                </SelectContent>
              </Select>
            </div>

            <div className='flex-1'>
              <label className='mb-2 block text-sm font-medium'>Хайх</label>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder='Зээл хайх...'
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    navigate({ search: { ...search, search: e.target.value } })
                  }}
                  className='pl-10'
                />
              </div>
            </div>
          </div>
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
          <MapContainer loans={filteredLocations} isLoading={isLoading} />
        </CardContent>
      </Card>
    </Main>
  )
}
