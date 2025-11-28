import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { stakeService, type StakeContract } from '@/services'
import { useDrawer } from '@/context/drawer-provider'
import { useFilterParams } from '@/hooks/use-filter-params'
import { useServerlessPagination } from '@/hooks/use-serverless-pagination'
import { ServerlessTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { ContractDetailContent } from './components/contract-detail-content'
import { StakeContractDialogs } from './components/dialogs'
import { StakeContractToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/stake/contract/')

export function StakeContract() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleNameClick = (contract: StakeContract) => {
    const contractId = contract.contractId || contract.stakeContractId
    if (!contractId) return

    openDrawer({
      title: 'Contract Details',
      description: 'View detailed information about this contract',
      content: <ContractDetailContent contract={contract} />,
    })
  }

  const columns = useMemo(
    () => createColumns({ onNameClick: handleNameClick }),
    [openDrawer]
  )

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const lastEvaluatedKeyFromUrl = useMemo(() => {
    const key = search.lastEvaluatedKey
    if (!key) return undefined
    if (typeof key === 'string') {
      try {
        return JSON.parse(key) as Record<string, unknown>
      } catch {
        return key
      }
    }
    return key as Record<string, unknown>
  }, [search.lastEvaluatedKey])

  const {
    data: contractList,
    refetch,
    isLoading: isLoadingContracts,
  } = useQuery({
    queryKey: [QUERY_KEYS.STAKE_CONTRACT_LIST, params, lastEvaluatedKeyFromUrl],
    queryFn: async () => {
      try {
        const requestParams: Parameters<
          typeof stakeService.listStakeContracts
        >[0] = {}
        if (lastEvaluatedKeyFromUrl) {
          requestParams.lastEvaluatedKey = lastEvaluatedKeyFromUrl
        }
        const res = await stakeService.listStakeContracts(requestParams)
        if (import.meta.env.DEV) {
          console.log('Stake Contracts API response:', res)
        }
        return {
          items: res?.body?.items || [],
          total: res?.body?.total || 0,
          lastEvaluatedKey: res?.body?.lastEvaluatedKey,
        }
      } catch (error) {
        console.error('Failed to fetch stake contracts:', error)
        return {
          items: [],
          total: 0,
          lastEvaluatedKey: undefined,
        }
      }
    },
    retry: 1,
    throwOnError: false,
  })

  const { hasNextPage, currentPage, handleNextPage, handlePreviousPage } =
    useServerlessPagination({
      lastEvaluatedKeyFromResponse: contractList?.lastEvaluatedKey,
      lastEvaluatedKeyFromUrl: lastEvaluatedKeyFromUrl,
      currentPageFromUrl: search.page,
      navigate,
      storageKey: 'stake-contract-list',
    })

  const toolbarConfig = useMemo(
    () => ({
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <StakeContractToolbarActions
          search={{
            start_day:
              typeof search.start_day === 'string'
                ? search.start_day
                : undefined,
            end_day:
              typeof search.end_day === 'string' ? search.end_day : undefined,
          }}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetch}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetch]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <ServerlessTable
        data={contractList?.items ?? []}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingContracts}
        UpdateComponent={({ open, onClose, onSuccess, data }) => (
          <StakeContractDialogs.StakeContractForm
            open={open}
            onClose={onClose}
            onSuccess={() => {
              onSuccess?.()
            }}
            data={data}
          />
        )}
        header={
          <TableHeader
            title='Stake Contracts'
            description='Manage staking contracts and configurations'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        hasNextPage={hasNextPage}
        currentPage={currentPage}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />
    </Main>
  )
}
