import { useEffect, useState } from 'react'
import { Filter, X } from 'lucide-react'
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
import { DateRangePicker } from '@/components/date-range-picker'

const BOOLEAN_OPTIONS = [
  { label: '✓ True', value: 'true' },
  { label: '✗ False', value: 'false' },
] as const

export type FilterFieldType = 'text' | 'select' | 'boolean' | 'date-range'

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
  title = 'Advanced Filters',
  description = 'Filter by multiple criteria. All filters are combined with AND logic.',
}: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterValues>(search)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...localFilters,
      [key]: value || undefined,
    }
    setLocalFilters(newFilters)
  }

  const handleApply = () => {
    onFilterChange(localFilters)
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

  const activeFiltersCount =
    Object.values(search).filter((v) => v !== undefined && v !== '').length +
    (dateRange?.start_day || dateRange?.end_day ? 1 : 0)

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <div className='space-y-2' key={field.key}>
            <label className='text-sm font-medium'>{field.label}</label>
            <Input
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}...`
              }
              value={localFilters[field.key] || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
            />
          </div>
        )

      case 'select':
        return (
          <div className='space-y-2' key={field.key}>
            <label className='text-sm font-medium'>{field.label}</label>
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
          <div className='space-y-2' key={field.key}>
            <label className='text-sm font-medium'>{field.label}</label>
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
          <div className='space-y-2' key={field.key}>
            <label className='text-sm font-medium'>{field.label}</label>
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange}
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
          Filters
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
      <PopoverContent className='w-96' align='start'>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{title}</h4>
            <p className='text-muted-foreground text-xs'>{description}</p>
          </div>

          <div className='space-y-4'>
            {fields.map((field) => renderField(field))}
          </div>

          {activeFiltersCount > 0 && (
            <div className='bg-muted flex flex-wrap gap-2 rounded-md border p-3'>
              <span className='text-muted-foreground text-xs font-medium'>
                Active filters:
              </span>
              {Object.entries(search).map(([key, value]) => {
                if (!value || value === '') return null
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

          <div className='flex justify-end gap-2 pt-2'>
            <Button variant='outline' size='sm' onClick={handleClear}>
              Clear All
            </Button>
            <Button size='sm' onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
