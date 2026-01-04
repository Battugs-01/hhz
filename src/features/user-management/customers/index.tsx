import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import type { Customer } from '@/services'
import { customerService } from '@/services'
import { useDrawer } from '@/context/drawer-provider'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { CustomerDetailContent } from './components/customer-detail-content'
import { CustomersToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/(user-management)/customers/')

export function Customers() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { openDrawer } = useDrawer()

  const handleIdClick = (customer: Customer) => {
    openDrawer({
      title: 'Харилцагчийн дэлгэрэнгүй мэдээлэл',
      description:
        'Харилцагчийн дэлгэрэнгүй мэдээлэл болон дэлгэрэнгүй мэдээллийг үзэх',
      content: <CustomerDetailContent customer={customer} />,
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
    isLoading: isLoadingCustomers,
  } = useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_LIST, params],
    queryFn: async () => {
      try {
        const res = await customerService.listCustomers(params)
        if (import.meta.env.DEV) {
          console.log('Customers API response:', res)
        }
        return {
          items: res?.body?.list || [],
          total: res?.body?.items || 0,
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error)
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
        <CustomersToolbarActions
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
      <BaseTable<Customer>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
        isLoading={isLoadingCustomers}
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
            title='Хэрэглэгчид'
            description='Харилцагчдын мэдээлэл болон дэлгэрэнгүй мэдээллийг үзэх'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
        hideAction
      />
    </Main>
  )
}
