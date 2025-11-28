import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DateRange = {
  start_day?: string
  end_day?: string
}

type DateRangePickerProps = {
  value?: DateRange
  onChange: (range: DateRange) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick date range',
  className,
}: DateRangePickerProps) {
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(
    value?.start_day ? new Date(value.start_day) : undefined
  )
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(
    value?.end_day ? new Date(value.end_day) : undefined
  )

  const [startDate, setStartDate] = useState<Date | undefined>(appliedStartDate)
  const [endDate, setEndDate] = useState<Date | undefined>(appliedEndDate)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setAppliedStartDate(
      value?.start_day ? new Date(value.start_day) : undefined
    )
    setAppliedEndDate(value?.end_day ? new Date(value.end_day) : undefined)
  }, [value?.start_day, value?.end_day])

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setStartDate(appliedStartDate)
      setEndDate(appliedEndDate)
    } else {
      // Reset to applied values when closing without applying
      setStartDate(appliedStartDate)
      setEndDate(appliedEndDate)
    }
    setOpen(isOpen)
  }

  const handleClear = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    const newRange: DateRange = {
      start_day: undefined,
      end_day: undefined,
    }
    onChange(newRange)
    setOpen(false)
  }

  const formatDateRange = () => {
    if (appliedStartDate && appliedEndDate) {
      return `${format(appliedStartDate, 'MMM d, yyyy')} - ${format(appliedEndDate, 'MMM d, yyyy')}`
    }
    if (appliedStartDate) {
      return `${format(appliedStartDate, 'MMM d, yyyy')} - ...`
    }
    if (appliedEndDate) {
      return `... - ${format(appliedEndDate, 'MMM d, yyyy')}`
    }
    return placeholder
  }

  const hasValue = appliedStartDate || appliedEndDate

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          data-empty={!hasValue}
          className={cn(
            'data-[empty=true]:text-muted-foreground h-8 justify-start text-start font-normal',
            className
          )}
        >
          <CalendarIcon className='me-2 h-4 w-4 opacity-50' />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='flex flex-col gap-2 p-3'>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <div className='flex flex-col gap-2'>
              <div className='px-3 text-sm font-medium'>Start Date</div>
              <Calendar
                mode='single'
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date)
                  const newRange: DateRange = {
                    start_day: date ? format(date, 'yyyy-MM-dd') : undefined,
                    end_day: endDate
                      ? format(endDate, 'yyyy-MM-dd')
                      : undefined,
                  }
                  onChange(newRange)
                }}
                disabled={(date: Date) => {
                  if (endDate && date > endDate) return true
                  return false
                }}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='px-3 text-sm font-medium'>End Date</div>
              <Calendar
                mode='single'
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date)
                  const newRange: DateRange = {
                    start_day: startDate
                      ? format(startDate, 'yyyy-MM-dd')
                      : undefined,
                    end_day: date ? format(date, 'yyyy-MM-dd') : undefined,
                  }
                  onChange(newRange)
                }}
                disabled={(date: Date) => {
                  if (startDate && date < startDate) return true
                  return false
                }}
              />
            </div>
          </div>
          <div className='flex justify-end gap-2 border-t px-3 pt-2'>
            <Button variant='outline' size='sm' onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
