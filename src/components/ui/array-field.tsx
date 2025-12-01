import { useRef } from 'react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/date-picker'
import { DateTimePicker } from '../datetime-picker'
import type { FormFieldConfig } from './config-form-dialog'

const NUMBER_INPUT_PATTERN = /^-?(\d+\.?\d*|\.\d+)$/
const TEMPORARY_NUMBER_VALUES = new Set(['', '-', '.', '-.'])

export function ArrayField<TFormData extends Record<string, unknown>>({
  field,
  form,
}: {
  field: FormFieldConfig<TFormData>
  form: UseFormReturn<TFormData>
}) {
  if (!field.arrayItemFields) return null

  const numberInputValuesRef = useRef<Record<string, string>>({})

  const {
    fields: arrayFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: field.name as any,
  })

  const getDefaultItemValue = () => {
    const defaultItem: Record<string, unknown> = {}
    field.arrayItemFields?.forEach((itemField) => {
      if (itemField.type === 'number') {
        defaultItem[itemField.name as string] = undefined
      } else if (itemField.type === 'date' || itemField.type === 'datetime') {
        defaultItem[itemField.name as string] = undefined
      } else {
        defaultItem[itemField.name as string] = ''
      }
    })
    return defaultItem
  }

  return (
    <FormField
      control={form.control}
      name={field.name as any}
      render={() => (
        <FormItem>
          <FormLabel>
            {field.label}
            {field.required && ' *'}
          </FormLabel>
          <div className='space-y-4'>
            {arrayFields.map((arrayField, index) => (
              <div
                key={arrayField.id}
                className='space-y-4 rounded-lg border p-4'
              >
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    {field.label} #{index + 1}
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
                <div className='grid grid-cols-1 gap-4'>
                  {field.arrayItemFields?.map((itemField) => {
                    const fieldPath =
                      `${String(field.name)}.${index}.${String(itemField.name)}` as any
                    return (
                      <FormField
                        key={String(itemField.name)}
                        control={form.control}
                        name={fieldPath}
                        render={({ field: itemFormField }) => (
                          <FormItem>
                            <FormLabel>
                              {itemField.label}
                              {itemField.required && ' *'}
                            </FormLabel>
                            <FormControl>
                              {itemField.type === 'number' ? (
                                <Input
                                  type='text'
                                  inputMode={
                                    itemField.step &&
                                    parseFloat(itemField.step) < 1
                                      ? 'decimal'
                                      : 'numeric'
                                  }
                                  placeholder={itemField.placeholder}
                                  step={itemField.step}
                                  min={
                                    itemField.min
                                      ? parseFloat(itemField.min)
                                      : undefined
                                  }
                                  className='[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                                  disabled={itemField.disabled}
                                  value={
                                    numberInputValuesRef.current[fieldPath] ??
                                    (itemFormField.value !== undefined &&
                                    itemFormField.value !== null
                                      ? String(itemFormField.value)
                                      : '')
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value

                                    // Allow empty or temporary values
                                    if (
                                      value === '' ||
                                      TEMPORARY_NUMBER_VALUES.has(value)
                                    ) {
                                      numberInputValuesRef.current[fieldPath] =
                                        value
                                      itemFormField.onChange(undefined as any)
                                      return
                                    }

                                    if (!NUMBER_INPUT_PATTERN.test(value)) {
                                      return
                                    }

                                    numberInputValuesRef.current[fieldPath] =
                                      value

                                    if (
                                      value.endsWith('.') &&
                                      !value.endsWith('..')
                                    ) {
                                      itemFormField.onChange(undefined as any)
                                      return
                                    }

                                    const parsedValue = Number(value)
                                    if (!Number.isNaN(parsedValue)) {
                                      itemFormField.onChange(parsedValue as any)
                                    }
                                  }}
                                  onBlur={() => {
                                    const value =
                                      numberInputValuesRef.current[fieldPath]
                                    if (value === undefined) return

                                    if (value === '0.' || value === '-0.') {
                                      itemFormField.onChange(0 as any)
                                      numberInputValuesRef.current[fieldPath] =
                                        '0'
                                      return
                                    }

                                    if (TEMPORARY_NUMBER_VALUES.has(value)) {
                                      numberInputValuesRef.current[fieldPath] =
                                        itemFormField.value !== undefined &&
                                        itemFormField.value !== null
                                          ? String(itemFormField.value)
                                          : ''
                                      return
                                    }

                                    const parsedValue = Number(value)
                                    if (!Number.isNaN(parsedValue)) {
                                      itemFormField.onChange(parsedValue as any)
                                      numberInputValuesRef.current[fieldPath] =
                                        String(parsedValue)
                                    }
                                  }}
                                />
                              ) : itemField.type === 'date' ? (
                                <DatePicker
                                  selected={
                                    itemFormField.value
                                      ? new Date(itemFormField.value as number)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    itemFormField.onChange(
                                      (date ? date.getTime() : undefined) as any
                                    )
                                  }}
                                  placeholder={
                                    itemField.placeholder || 'Pick a date'
                                  }
                                />
                              ) : itemField.type === 'datetime' ? (
                                <DateTimePicker
                                  selected={
                                    itemFormField.value
                                      ? new Date(itemFormField.value as number)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    itemFormField.onChange(
                                      (date ? date.getTime() : undefined) as any
                                    )
                                  }}
                                  placeholder={
                                    itemField.placeholder ||
                                    'Pick a date and time'
                                  }
                                />
                              ) : (
                                <Input
                                  type={itemField.type}
                                  placeholder={itemField.placeholder}
                                  {...itemFormField}
                                  value={(itemFormField.value as string) || ''}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => append(getDefaultItemValue() as any)}
              className='w-full'
            >
              <Plus className='mr-2 h-4 w-4' />
              {field.addButtonLabel || `Add ${field.label}`}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
