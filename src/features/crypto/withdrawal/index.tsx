import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { CryptoWithdrawal } from '@/services'
import { cryptoService } from '@/services'
import { useDrawer } from '@/context/drawer-provider'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { CryptoWithdrawalDetailContent } from './components/crypto-withdrawal-detail-content'
import { CryptoWithdrawalToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/crypto/withdrawal/')

export function CryptoWithdrawal() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleIdClick = (withdrawal: CryptoWithdrawal) => {
    openDrawer({
      title: 'Crypto Withdrawal Details',
      description:
        'View detailed information about this crypto withdrawal transaction',
      content: <CryptoWithdrawalDetailContent withdrawal={withdrawal} />,
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
    data: list,
    refetch,
    isLoading: isLoadingCryptoWithdrawals,
  } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO_WITHDRAWAL_LIST, params],
    queryFn: async () => {
      try {
        const res = await cryptoService.listCryptoWithdrawals(params)
        if (import.meta.env.DEV) {
          console.log('Crypto Withdrawals API response:', res)
        }
        return {
          items: res?.body?.items || [],
          total: res?.body?.total || 0,
        }
      } catch (error) {
        console.error('Failed to fetch crypto withdrawals:', error)
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
      searchPlaceholder: TABLE_CONFIG.SEARCH_PLACEHOLDER,
      searchKey: TABLE_CONFIG.SEARCH_KEY,
      filters: [],
      extra: (
        <CryptoWithdrawalToolbarActions
          search={search}
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
      <BaseTable<CryptoWithdrawal>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingCryptoWithdrawals}
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
            title='Crypto Withdrawals'
            description='Manage and view all crypto withdrawal transactions'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
      />
    </Main>
  )
}
