import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cryptoService, type WalletAddress } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable } from '@/components/data-table'
import { createColumns as createWalletAddressColumns } from '@/features/crypto/wallet-address/components/columns'

type AddressesContentProps = {
  userId: string
}

export function AddressesContent({ userId }: AddressesContentProps) {
  const [search, setSearch] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 20,
    query: userId,
  })

  useEffect(() => {
    setSearch((prev) => ({
      ...prev,
      query: userId,
    }))
  }, [userId])

  const navigate = (options: {
    search:
      | true
      | Record<string, unknown>
      | ((prev: Record<string, unknown>) => Record<string, unknown>)
  }) => {
    if (options.search === true) {
      return
    }
    if (typeof options.search === 'function') {
      const searchFn = options.search
      setSearch((prev) => {
        const newSearch = searchFn(prev) as Record<string, unknown>
        // Ensure query always contains userId
        return {
          ...newSearch,
          query: userId,
        }
      })
    } else if (typeof options.search === 'object') {
      setSearch({
        ...options.search,
        query: userId,
      })
    }
  }

  const { params } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: 20,
    searchKey: 'query',
    navigate,
  })

  const columns = useMemo(() => createWalletAddressColumns(), [])

  const { data: list, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['user-wallet-addresses', userId, params],
    queryFn: async () => {
      const res = await cryptoService.listWalletAddresses({
        query: userId,
        current: params.current,
        pageSize: params.pageSize,
      })
      return {
        items: res?.body?.items || [],
        total: res?.body?.total || 0,
      }
    },
    enabled: !!userId,
    retry: 1,
    throwOnError: false,
  })

  return (
    <BaseTable<WalletAddress>
      data={list?.items ?? []}
      total={list?.total}
      columns={columns}
      search={search}
      navigate={navigate}
      tableId='user-wallet-addresses'
      isLoading={isLoadingAddresses}
      tableConfig={{
        pagination: {
          defaultPage: 1,
          defaultPageSize: 20,
        },
        globalFilter: { enabled: false },
      }}
      hideToolbar
    />
  )
}
