import { type ReactNode, useEffect, useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  type TableOptions,
  type Table as TanStackTable,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  CreateDialogProps,
  DeleteDialogProps,
  DetailDialogProps,
  UpdateDialogProps,
} from '@/lib/dialog-types'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from './index'

// Legacy Dialog Component Props (backwards compatibility)
export interface ActionComponentProps<TData> {
  open: boolean
  onCancel: () => void
  onFinish: () => void
  detail?: TData
  details?: TData[]
  setCloseModal?: (record: TData) => void
  setWaitModal?: (record: TData) => void
  setApproveModal?: (record: TData) => void
  setTransictionModal?: (record: TData) => void
}

// Toolbar Config Props
export interface ToolbarConfig {
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  extra?: ReactNode
  /** Debounce хугацаа (ms), default 500ms */
  debounceDelay?: number
}

// Table Config Props
export interface TableConfig {
  pagination?: {
    pageKey?: string
    pageSizeKey?: string
    defaultPage?: number
    defaultPageSize?: number
  }
  globalFilter?: {
    enabled?: boolean
    key?: string
    trim?: boolean
  }
  columnFilters?: Array<
    | {
        columnId: string
        searchKey: string
        type?: 'string'
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
    | {
        columnId: string
        searchKey: string
        type: 'array'
        serialize?: (value: unknown) => unknown
        deserialize?: (value: unknown) => unknown
      }
  >
}

// Main Table Props
export interface BaseTableProps<TData> {
  // Data
  data: TData[]
  total?: number
  columns: ColumnDef<TData>[]

  // URL State
  search: Record<string, unknown>
  navigate: NavigateFn
  tableConfig?: TableConfig

  // Dialogs (Standard Interface - Recommended)
  CreateComponent?: React.ComponentType<CreateDialogProps>
  UpdateComponent?: React.ComponentType<UpdateDialogProps<TData>>
  DeleteComponent?: React.ComponentType<DeleteDialogProps<TData>>
  DetailComponent?: React.ComponentType<DetailDialogProps<TData>>

  // Actions
  hideAction?: boolean
  customActions?: (record: TData) => ReactNode
  hideEditButton?: (record: TData) => boolean
  hideDeleteButton?: (record: TData) => boolean
  showDetailButton?: (record: TData) => boolean

  // Toolbar
  toolbar?: ToolbarConfig
  hideToolbar?: boolean

  // Table Options
  enableRowSelection?: boolean
  manualPagination?: boolean
  manualFiltering?: boolean
  tableId?: string

  // Custom render
  header?: ReactNode
  renderBeforeTable?: ReactNode
  renderAfterTable?: (table: TanStackTable<TData>) => ReactNode
  emptyState?: ReactNode

  // Callbacks
  onRefresh?: () => void
  onUpdate?: (record: TData) => void
  onDelete?: (record: TData) => void
  onDetail?: (record: TData) => void

  // Additional props
  rowKey?: keyof TData | ((record: TData) => string | number)
  className?: string
}

// Row Actions Component
function RowActions<TData>({
  record,
  onEdit,
  onDelete,
  onDetail,
  hideEditButton,
  hideDeleteButton,
  showDetailButton,
  customActions,
}: {
  record: TData
  onEdit?: () => void
  onDelete?: () => void
  onDetail?: () => void
  hideEditButton?: (record: TData) => boolean
  hideDeleteButton?: (record: TData) => boolean
  showDetailButton?: (record: TData) => boolean
  customActions?: (record: TData) => ReactNode
}) {
  const canEdit = !hideEditButton || !hideEditButton(record)
  const canDelete = !hideDeleteButton || !hideDeleteButton(record)
  const canDetail = showDetailButton && showDetailButton(record)
  const hasActions = onDetail || onEdit || onDelete || customActions

  if (!hasActions) return null

  return (
    <div className='flex items-center justify-end gap-2'>
      {onDetail && (
        <button
          type='button'
          onClick={onDetail}
          disabled={canDetail}
          className={cn(
            'rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50',
            canDetail && 'cursor-not-allowed opacity-50'
          )}
        >
          Detail
        </button>
      )}
      {onEdit && (
        <button
          type='button'
          onClick={onEdit}
          disabled={!canEdit}
          className={cn(
            'rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50',
            !canEdit && 'cursor-not-allowed opacity-50'
          )}
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          type='button'
          onClick={onDelete}
          disabled={!canDelete}
          className={cn(
            'rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50',
            !canDelete && 'cursor-not-allowed opacity-50'
          )}
        >
          Delete
        </button>
      )}
      {customActions && customActions(record)}
    </div>
  )
}

export function BaseTable<TData extends Record<string, unknown>>({
  data,
  total,
  columns,
  search,
  navigate,
  tableConfig = {},
  CreateComponent,
  UpdateComponent,
  DeleteComponent,
  DetailComponent,
  hideAction = false,
  customActions,
  hideEditButton,
  hideDeleteButton,
  showDetailButton,
  toolbar,
  hideToolbar = false,
  enableRowSelection = true,
  manualPagination = true,
  manualFiltering = true,
  tableId,
  header,
  renderBeforeTable,
  renderAfterTable,
  emptyState,
  onRefresh,
  onUpdate,
  onDelete,
  onDetail,
  rowKey = 'id' as keyof TData,
  className,
}: BaseTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [updateRecord, setUpdateRecord] = useState<TData | undefined>()
  const [deleteRecord, setDeleteRecord] = useState<TData | undefined>()
  const [detailRecord, setDetailRecord] = useState<TData | undefined>()

  // URL State
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
    globalFilter,
    onGlobalFilterChange,
  } = useTableUrlState({
    search,
    navigate,
    ...tableConfig,
  })

  // Calculate page count
  const pageCount =
    total && pagination.pageSize ? Math.ceil(total / pagination.pageSize) : -1

  // Add action column if needed
  const tableColumns: ColumnDef<TData>[] = [
    ...columns,
    ...(hideAction
      ? []
      : [
          {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
              <RowActions
                record={row.original}
                onEdit={
                  UpdateComponent || onUpdate
                    ? () => {
                        setUpdateRecord(row.original)
                        onUpdate?.(row.original)
                      }
                    : undefined
                }
                onDelete={
                  DeleteComponent || onDelete
                    ? () => {
                        setDeleteRecord(row.original)
                        onDelete?.(row.original)
                      }
                    : undefined
                }
                onDetail={
                  DetailComponent || onDetail
                    ? () => {
                        setDetailRecord(row.original)
                        onDetail?.(row.original)
                      }
                    : undefined
                }
                hideEditButton={hideEditButton}
                hideDeleteButton={hideDeleteButton}
                showDetailButton={showDetailButton}
                customActions={customActions}
              />
            ),
            enableSorting: false,
            enableHiding: false,
          } as ColumnDef<TData>,
        ]),
  ]

  // Table instance
  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
      ...(globalFilter !== undefined && { globalFilter }),
    },
    enableRowSelection,
    manualPagination,
    manualFiltering,
    pageCount,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    ...(onGlobalFilterChange && { onGlobalFilterChange }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => {
      if (typeof rowKey === 'function') {
        return String(rowKey(row))
      }
      return String(row[rowKey] ?? '')
    },
  } as TableOptions<TData>)

  useEffect(() => {
    if (pageCount > 0) {
      ensurePageInRange(pageCount)
    }
  }, [pageCount, ensurePageInRange])

  return (
    <div className={cn('flex flex-1 flex-col gap-4', className)}>
      {header}

      {!hideToolbar && toolbar && (
        <div className='flex items-center justify-between gap-4'>
          <DataTableToolbar
            table={table}
            searchPlaceholder={toolbar.searchPlaceholder || 'Filter...'}
            searchKey={toolbar.searchKey}
            filters={toolbar.filters}
            debounceDelay={toolbar.debounceDelay}
          />
          {toolbar.extra}
        </div>
      )}

      {renderBeforeTable}

      <div className='overflow-hidden rounded-md border'>
        <Table id={tableId}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        (header.column.columnDef.meta as any)?.thClassName
                      )}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        (cell.column.columnDef.meta as any)?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className='h-24 text-center'
                >
                  {emptyState || 'No data available.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className='mt-auto' />

      {renderAfterTable && renderAfterTable(table)}

      {CreateComponent && (
        <CreateComponent
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false)
            onRefresh?.()
          }}
        />
      )}

      {UpdateComponent && updateRecord && (
        <UpdateComponent
          open={!!updateRecord}
          onClose={() => setUpdateRecord(undefined)}
          onSuccess={() => {
            setUpdateRecord(undefined)
            onRefresh?.()
          }}
          data={updateRecord}
        />
      )}

      {DeleteComponent && deleteRecord && (
        <DeleteComponent
          open={!!deleteRecord}
          onClose={() => setDeleteRecord(undefined)}
          onSuccess={() => {
            setDeleteRecord(undefined)
            onRefresh?.()
          }}
          data={deleteRecord}
        />
      )}

      {DetailComponent && detailRecord && (
        <DetailComponent
          open={!!detailRecord}
          onClose={() => setDetailRecord(undefined)}
          onSuccess={() => setDetailRecord(undefined)}
          data={detailRecord}
        />
      )}
    </div>
  )
}
