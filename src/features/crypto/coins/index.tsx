import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { cryptoService, type Coin } from '@/services'
import { useDrawer } from '@/context/drawer-provider'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { CoinDetailContent } from './components/coin-detail-content'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { CoinsToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/crypto/coins/')

export function Coins() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleIdClick = (coin: Coin) => {
    openDrawer({
      title: 'Coin Details',
      description: 'View detailed information about this cryptocurrency coin',
      content: <CoinDetailContent coin={coin} />,
    })
  }

  const columns = useMemo(
    () => createColumns({ onIdClick: handleIdClick }),
    [openDrawer]
  )

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const {
    data: coinList,
    refetch: refetchCoins,
    isLoading: isLoadingCoins,
  } = useQuery({
    queryKey: [QUERY_KEYS.COINS_LIST, params],
    queryFn: async () => {
      try {
        const res = await cryptoService.listCoins({
          current: params.current,
          pageSize: params.pageSize,
          query: params.query,
          symbol:
            typeof search.symbol === 'string' && search.symbol !== ''
              ? search.symbol
              : undefined,
          trading:
            typeof search.trading === 'string'
              ? search.trading === 'true'
              : undefined,
          deposit:
            typeof search.deposit === 'string'
              ? search.deposit === 'true'
              : undefined,
          withdrawals:
            typeof search.withdrawals === 'string'
              ? search.withdrawals === 'true'
              : undefined,
        })
        if (import.meta.env.DEV) {
          console.log('Coins API response:', res)
        }
        return {
          items: res?.body?.items || [],
          total: res?.body?.total || 0,
        }
      } catch (error) {
        console.error('Failed to fetch coins:', error)
        return {
          items: [],
          total: 0,
        }
      }
    },
    retry: 1,
    throwOnError: false,
  })

  const toolbarConfig = useMemo(
    () => ({
      filters: [],
      extra: (
        <CoinsToolbarActions
          search={search}
          navigate={navigate}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={refetchCoins}
        />
      ),
    }),
    [search, navigate, handleDateRangeChange, refetchCoins]
  )

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <BaseTable<Coin>
        data={coinList?.items ?? []}
        total={coinList?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingCoins}
        tableConfig={{
          pagination: {
            defaultPage: TABLE_CONFIG.DEFAULT_PAGE,
            defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
          },
          globalFilter: { enabled: false },
          columnFilters: [
            {
              columnId: 'id',
              searchKey: TABLE_CONFIG.SEARCH_KEY,
              type: 'string',
            },
          ],
        }}
        header={
          <TableHeader
            title='Coins'
            description='View and manage cryptocurrency coins'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetchCoins}
      />
    </Main>
  )
}
