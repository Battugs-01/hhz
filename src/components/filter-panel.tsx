import { DateRangePicker } from '@/components/date-range-picker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const BOOLEAN_OPTIONS = [
  { label: '✓ True', value: 'true' },
  { label: '✗ False', value: 'false' },
] as const

const COMPARISON_OPERATORS = [
  { label: '= Тэнцүү', value: 'eq' },
  { label: '> Их', value: 'gt' },
  { label: '< Бага', value: 'lt' },
  { label: '≥ Их/тэнцүү', value: 'gte' },
  { label: '≤ Бага/тэнцүү', value: 'lte' },
] as const

export type FilterFieldType =
  | 'text'
  | 'number'
  | 'number-comparison'
  | 'select'
  | 'boolean'
  | 'date-range'

export type FilterFieldOption = {
  label: string
  value: string
}

export type FilterField = {
  key: string
  label: string
  type: FilterFieldType
  placeholder?: string
  options?: FilterFieldOption[]
  showWhen?: {
    field: string
    hasValue?: boolean
  }
}

export type FilterValues = Record<string, string | undefined>

type FilterPanelProps = {
  fields: FilterField[]
  search: FilterValues
  onFilterChange: (filters: FilterValues) => void
  onClear: () => void
  dateRange?: {
    start_day?: string
    end_day?: string
  }
  onDateRangeChange?: (range: { start_day?: string; end_day?: string }) => void
  title?: string
  description?: string
}

export function FilterPanel({
  fields,
  search,
  onFilterChange,
  onClear,
  dateRange,
  onDateRangeChange,
  title = 'Нарийвчилсан шүүлтүүр',
  description = 'Олон шалгуураар шүүх. Бүх шүүлтүүр AND логикоор нэгтгэгдэнэ.',
}: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterValues>(search)
  const [localDateRange, setLocalDateRange] = useState<{
    start_day?: string
    end_day?: string
  }>(dateRange || {})

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...localFilters,
      [key]: value || undefined,
    }

    // Clear dependent fields when their dependency is cleared
    fields.forEach((field) => {
      if (field.showWhen?.field === key && !value) {
        newFilters[field.key] = undefined
      }
    })

    // Clear operator when value is cleared for number-comparison fields
    if (!value && !key.endsWith('_operator')) {
      const operatorKey = `${key}_operator`
      if (newFilters[operatorKey] !== undefined) {
        newFilters[operatorKey] = undefined
      }
    }

    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    // Set default operator 'eq' for number-comparison fields that have value but no operator
    const filtersWithDefaults = { ...localFilters }
    fields.forEach((field) => {
      if (field.type === 'number-comparison') {
        const valueKey = field.key
        const operatorKey = `${field.key}_operator`
        const hasValue =
          filtersWithDefaults[valueKey] && filtersWithDefaults[valueKey] !== ''
        const hasOperator =
          filtersWithDefaults[operatorKey] &&
          filtersWithDefaults[operatorKey] !== ''

        if (hasValue && !hasOperator) {
          filtersWithDefaults[operatorKey] = 'eq'
        }
      }
    })

    onFilterChange(filtersWithDefaults)
    if (onDateRangeChange) {
      onDateRangeChange(localDateRange)
    }
    setOpen(false)
  }

  const handleClear = () => {
    const emptyFilters: FilterValues = {}
    setLocalFilters(emptyFilters)
    onFilterChange(emptyFilters)
    onClear()
    if (onDateRangeChange) {
      onDateRangeChange({ start_day: undefined, end_day: undefined })
    }
    setOpen(false)
  }
  useEffect(() => {
    setLocalFilters(search)
  }, [search])

  useEffect(() => {
    setLocalDateRange(dateRange || {})
  }, [dateRange])

  const activeFiltersCount =
    Object.entries(search).filter(
      ([key, value]) =>
        value !== undefined && value !== '' && !key.endsWith('_operator')
    ).length + (dateRange?.start_day || dateRange?.end_day ? 1 : 0)

  // Filter fields based on their showWhen conditions
  const visibleFields = fields.filter((field) => {
    if (!field.showWhen) return true

    const { field: dependentField, hasValue = true } = field.showWhen
    const dependentValue = localFilters[dependentField]
    const hasDependentValue =
      dependentValue !== undefined && dependentValue !== ''

    return hasValue ? hasDependentValue : !hasDependentValue
  })

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <div className='space-y-1.5' key={field.key}>
            <label className='text-xs font-medium'>{field.label}</label>
            <Input
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}...`
              }
              value={localFilters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
            />
          </div>
        )

      case 'number':
        return (
          <div className='space-y-1.5' key={field.key}>
            <label className='text-xs font-medium'>{field.label}</label>
            <Input
              type='number'
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}...`
              }
              value={localFilters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
            />
          </div>
        )

      case 'number-comparison': {
        const operatorKey = `${field.key}_operator`
        const valueKey = field.key
        const hasValue = localFilters[valueKey] && localFilters[valueKey] !== ''
        return (
          <div className='space-y-1.5' key={field.key}>
            <label className='text-xs font-medium'>{field.label}</label>
            <div className='flex gap-2'>
              {hasValue && (
                <Select
                  value={localFilters[operatorKey] || 'eq'}
                  onValueChange={(value) =>
                    handleFilterChange(operatorKey, value)
                  }
                >
                  <SelectTrigger className='w-[110px]'>
                    <SelectValue placeholder='Харьц' />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPARISON_OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Input
                type='number'
                placeholder={field.placeholder || 'Утга оруулах...'}
                value={localFilters[valueKey] || ''}
                onChange={(e) => handleFilterChange(valueKey, e.target.value)}
                className='flex-1'
              />
            </div>
          </div>
        )
      }

      case 'select':
        return (
          <div className='space-y-1.5' key={field.key}>
            <label className='text-xs font-medium'>{field.label}</label>
            <Select
              value={localFilters[field.key] || ''}
              onValueChange={(value) => handleFilterChange(field.key, value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    field.placeholder ||
                    `Select ${field.label.toLowerCase()}...`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'boolean':
        return (
          <div className='space-y-1.5' key={field.key}>
            <label className='text-xs font-medium'>{field.label}</label>
            <Select
              value={localFilters[field.key] || ''}
              onValueChange={(value) => handleFilterChange(field.key, value)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    field.placeholder ||
                    `Select ${field.label.toLowerCase()}...`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {BOOLEAN_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'date-range':
        if (!onDateRangeChange) return null
        return (
          <div className='space-y-1.5' key={field.key}>
            <label className='text-xs font-medium'>{field.label}</label>
            <DateRangePicker
              value={localDateRange}
              onChange={setLocalDateRange}
              placeholder={field.placeholder || 'Filter by date'}
              className='w-full'
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 gap-2'>
          <Filter className='h-4 w-4' />
          Шүүлтүүр
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 h-5 w-5 rounded-full p-0 px-1.5 text-xs'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='flex w-96 flex-col p-0 overflow-hidden'
        align='start'
        collisionPadding={10}
        style={{
          maxHeight: 'var(--radix-popover-content-available-height)',
        }}
      >
        <div className='flex-shrink-0 space-y-1 border-b p-3'>
          <h4 className='text-sm font-semibold'>{title}</h4>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>

          <div className='min-h-0 flex-1 space-y-2.5 overflow-y-auto p-3 pb-2'>
            {visibleFields.map((field) => renderField(field))}
          </div>

          {activeFiltersCount > 0 && (
            <div className='bg-muted mx-3 mb-3 flex max-h-24 flex-shrink-0 flex-wrap gap-2 overflow-y-auto rounded-md border p-2'>
              <span className='text-muted-foreground text-xs font-medium'>
                Идэвхтэй:
              </span>
              {Object.entries(search).map(([key, value]) => {
                if (!value || value === '' || key.endsWith('_operator'))
                  return null
                const field = fields.find((f) => f.key === key)
                return (
                  <Badge key={key} variant='secondary' className='gap-1'>
                    <span className='font-medium'>{field?.label || key}:</span>
                    <span>{value}</span>
                    <button
                      type='button'
                      onClick={() => {
                        const newFilters = {
                          ...localFilters,
                          [key]: undefined,
                        }
                        setLocalFilters(newFilters)
                        onFilterChange(newFilters)
                      }}
                      className='hover:bg-muted-foreground/20 ml-1 rounded-full'
                      aria-label={`Clear ${key} filter`}
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                )
              })}
              {dateRange?.start_day || dateRange?.end_day ? (
                <Badge variant='secondary' className='gap-1'>
                  <span className='font-medium'>date:</span>
                  <span>
                    {dateRange.start_day || '...'} -{' '}
                    {dateRange.end_day || '...'}
                  </span>
                  <button
                    type='button'
                    onClick={() => {
                      if (onDateRangeChange) {
                        onDateRangeChange({
                          start_day: undefined,
                          end_day: undefined,
                        })
                      }
                    }}
                    className='hover:bg-muted-foreground/20 ml-1 rounded-full'
                    aria-label='Clear date range filter'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ) : null}
            </div>
          )}

          <div className='bg-popover flex flex-shrink-0 justify-end gap-2 border-t p-3'>
            <Button variant='outline' size='sm' onClick={handleClear}>
              Цэвэрлэх
            </Button>
            <Button size='sm' onClick={handleApply}>
              Хэрэглэх
            </Button>
          </div>
      </PopoverContent>
    </Popover>
  )
}
