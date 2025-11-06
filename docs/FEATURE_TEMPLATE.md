# Feature Template: Data Table with Filters

Энэ template нь `user-information` feature-ийн бүтцийг ашиглан шинэ feature үүсгэхэд ашиглах боломжтой.

## 📁 Folder Structure

```
src/features/[feature-name]/
├── index.tsx                    # Main component
├── components/
│   ├── columns.tsx              # Table column definitions
│   ├── constants.ts             # Constants (filters, config, query keys)
│   ├── toolbar-actions.tsx      # Toolbar actions component
│   ├── dialogs.tsx              # Dialog components (optional)
│   └── schemas.ts               # Zod schemas (optional)
└── [route file]
    └── index.tsx                # Route definition with search schema
```

## 🚀 Quick Start

### 1. Create Route File

```typescript
// src/routes/_authenticated/[route-path]/index.tsx
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { YourFeature } from '@/features/[feature-name]'

export const yourFeatureSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
  // Add your search parameters
  status: z.string().optional(),
  type: z.string().optional(),
  start_day: z.string().optional(),
  end_day: z.string().optional(),
})

export type YourFeatureSearch = z.infer<typeof yourFeatureSearchSchema>

export const Route = createFileRoute('/_authenticated/[route-path]/')({
  validateSearch: yourFeatureSearchSchema,
  component: YourFeature,
})
```

### 2. Create Constants

```typescript
// src/features/[feature-name]/components/constants.ts
import type { FilterField } from '@/components/filter-panel'

export const FILTER_KEYS = ['status', 'type'] as const

export const YOUR_FEATURE_FILTER_FIELDS: FilterField[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    type: 'text',
    placeholder: 'Enter type...',
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'date-range',
    placeholder: 'Filter by date',
  },
]

export const QUERY_KEYS = {
  YOUR_FEATURE_LIST: 'your-feature',
  YOUR_FEATURE_DETAIL: 'your-feature-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'your-feature-table',
  EXPORT_FILE_NAME: 'your-feature.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'name', // or 'email', 'id', etc.
  SEARCH_PLACEHOLDER: 'Search by name...',
} as const
```

### 3. Create Columns

```typescript
// src/features/[feature-name]/components/columns.tsx
import { type Column, type ColumnDef, type Row } from '@tanstack/react-table'
import { type YourDataType } from '@/services'
import { DataTableColumnHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'

export const createColumns = (): ColumnDef<YourDataType>[] => {
  return [
    {
      accessorKey: 'id',
      header: ({ column }: { column: Column<YourDataType> }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }: { row: Row<YourDataType> }) => {
        return <div>{row.getValue('id')}</div>
      },
      enableSorting: false,
    },
    // Add more columns...
  ]
}
```

### 4. Create Toolbar Actions

```typescript
// src/features/[feature-name]/components/toolbar-actions.tsx
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FilterToolbarActions } from '@/components/filter-toolbar-actions'
import {
  FILTER_KEYS,
  TABLE_CONFIG,
  YOUR_FEATURE_FILTER_FIELDS,
} from './constants'

type YourFeatureToolbarActionsProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  onRefresh: () => void
}

export function YourFeatureToolbarActions({
  search,
  navigate,
  onDateRangeChange,
  onRefresh,
}: YourFeatureToolbarActionsProps) {
  return (
    <FilterToolbarActions
      fields={YOUR_FEATURE_FILTER_FIELDS}
      search={{
        status: typeof search.status === 'string' ? search.status : undefined,
        type: typeof search.type === 'string' ? search.type : undefined,
        start_day:
          typeof search.start_day === 'string' ? search.start_day : undefined,
        end_day:
          typeof search.end_day === 'string' ? search.end_day : undefined,
      }}
      navigate={navigate}
      filterKeys={FILTER_KEYS}
      onDateRangeChange={onDateRangeChange}
      onRefresh={onRefresh}
      tableId={TABLE_CONFIG.ID}
      exportFileName={TABLE_CONFIG.EXPORT_FILE_NAME}
    />
  )
}
```

### 5. Create Main Component

```typescript
// src/features/[feature-name]/index.tsx
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { yourService, type YourDataType } from '@/services'
import { useFilterParams } from '@/hooks/use-filter-params'
import { BaseTable, TableHeader } from '@/components/data-table'
import { Main } from '@/components/layout/main'
import { createColumns } from './components/columns'
import { QUERY_KEYS, TABLE_CONFIG } from './components/constants'
import { YourFeatureToolbarActions } from './components/toolbar-actions'

const route = getRouteApi('/_authenticated/[route-path]/')

export function YourFeature() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const columns = useMemo(() => createColumns(), [])

  const { params, handleDateRangeChange } = useFilterParams(search, {
    defaultMonths: 0,
    defaultPageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    searchKey: TABLE_CONFIG.SEARCH_KEY,
    navigate,
  })

  const { data: list, refetch } = useQuery({
    queryKey: [QUERY_KEYS.YOUR_FEATURE_LIST, params],
    queryFn: async () => {
      const res = await yourService.list(params)
      return {
        items: res?.body?.items || [],
        total: res?.body?.total || 0,
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
        <YourFeatureToolbarActions
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
      <BaseTable<YourDataType>
        data={list?.items ?? []}
        total={list?.total}
        columns={columns}
        search={search}
        navigate={navigate}
        tableId={TABLE_CONFIG.ID}
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
            title='Your Feature Title'
            description='Your feature description'
          />
        }
        toolbar={toolbarConfig}
        onRefresh={refetch}
      />
    </Main>
  )
}
```

## 🎯 Key Components

### Global Components Used:
- `FilterPanel` - Advanced filter panel
- `FilterToolbarActions` - Toolbar with filters, refresh, export
- `useFilterHandlers` - Filter change/clear handlers
- `useFilterParams` - URL params management
- `BaseTable` - Data table component

## 📝 Checklist

Шинэ feature үүсгэхэд:

- [ ] Route file үүсгэх (search schema-тай)
- [ ] Constants file үүсгэх (FILTER_KEYS, FILTER_FIELDS, QUERY_KEYS, TABLE_CONFIG)
- [ ] Columns file үүсгэх
- [ ] Toolbar actions file үүсгэх
- [ ] Main index.tsx file үүсгэх
- [ ] Service method нэмэх (list function)
- [ ] Type definitions нэмэх

## 💡 Tips

1. **Filter Fields**: Зөвхөн шаардлагатай filter fields-ийг нэмэх
2. **Constants**: Бүх magic numbers/strings-ийг constants дотор төвлөрүүлэх
3. **Type Safety**: Route schema-аас type export хийх
4. **Reusability**: Global components ашиглах

## 🔗 Related Files

- `/src/components/filter-panel.tsx` - Global filter panel
- `/src/components/filter-toolbar-actions.tsx` - Global toolbar actions
- `/src/hooks/use-filter-handlers.ts` - Filter handlers hook
- `/src/hooks/use-filter-params.ts` - URL params hook
