import { useRef } from 'react'
import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Checkbox } from '@radix-ui/react-checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/date-picker'
import { DateTimePicker } from '../datetime-picker'
import type { FormFieldConfig } from './config-form-dialog'
import { HtmlEditor } from './html-editor'
import { MarkdownEditor } from './markdown-editor'
import { Textarea } from './textarea'

const NUMBER_INPUT_PATTERN = /^-?\d*(\.\d*)?$/
const TEMPORARY_NUMBER_VALUES = new Set(['', '-', '.', '-.'])

export function SubArrayField<TFormData extends Record<string, unknown>>({
  field,
  form,
  parentPath, // 👈 энд path авна
}: {
  field: FormFieldConfig<TFormData>
  form: UseFormReturn<TFormData>
  parentPath: string
}) {
  if (!field.arrayItemFields) return null

  const numberInputValuesRef = useRef<Record<string, string>>({})

  const {
    fields: arrayFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: parentPath as any,
  })

  const shouldShowField = (itemField: FormFieldConfig<any>): boolean => {
    if (!itemField.showWhen) return true

    const fieldName = itemField.showWhen.field
    const fieldPath = String(fieldName)

    const dependentValue = fieldPath.includes('.')
      ? form.watch(fieldPath as any)
      : form.watch(fieldName as any)

    if (itemField.showWhen.hasValue !== undefined) {
      return itemField.showWhen.hasValue ? !!dependentValue : !dependentValue
    }
    if (itemField.showWhen.notValue !== undefined) {
      return dependentValue !== itemField.showWhen.notValue
    }
    if (itemField.showWhen.value !== undefined) {
      return dependentValue === itemField.showWhen.value
    }
    return !!dependentValue
  }

  const getDefaultItemValue = () => {
    const defaultItem: Record<string, unknown> = {}
    field.arrayItemFields?.forEach((itemField) => {
      if (itemField.type === 'number') {
        defaultItem[itemField.name as string] = 0
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
                    if (!shouldShowField(itemField)) return null

                    const fieldPath =
                      `${String(itemField.name)}.${index}.${String(itemField.name)}` as any
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
                              {itemField.type === 'checkbox' ? (
                                <div className='flex items-center space-x-2'>
                                  <Checkbox
                                    checked={itemFormField.value as boolean}
                                    onCheckedChange={(checked) => {
                                      itemFormField.onChange(checked as any)
                                    }}
                                  />
                                  {itemField.placeholder && (
                                    <span className='text-muted-foreground text-sm'>
                                      {itemField.placeholder}
                                    </span>
                                  )}
                                </div>
                              ) : itemField.type === 'select' ? (
                                <Select
                                  value={(itemFormField.value as string) || ''}
                                  onValueChange={itemFormField.onChange}
                                >
                                  <SelectTrigger className='w-full'>
                                    <SelectValue
                                      placeholder={
                                        itemField.placeholder || 'Select...'
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {itemField.options?.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : itemField.type === 'markdown' ? (
                                <MarkdownEditor
                                  value={(itemFormField.value as string) || ''}
                                  onChange={(value: string) => {
                                    itemFormField.onChange(value as any)
                                  }}
                                />
                              ) : itemField.type === 'html' ? (
                                <HtmlEditor
                                  value={(itemFormField.value as string) || ''}
                                  onChange={(value: string) => {
                                    itemFormField.onChange(value as any)
                                  }}
                                  placeholder={itemField.placeholder}
                                />
                              ) : itemField.type === 'textarea' ? (
                                <Textarea
                                  placeholder={itemField.placeholder}
                                  rows={itemField.rows || 3}
                                  disabled={itemField.disabled}
                                  {...itemFormField}
                                  value={(itemFormField.value as string) || ''}
                                />
                              ) : itemField.type === 'date' ? (
                                <div className='w-full'>
                                  <DatePicker
                                    selected={
                                      itemFormField.value
                                        ? new Date(
                                            itemFormField.value as number
                                          )
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      itemFormField.onChange(
                                        (date
                                          ? date.getTime()
                                          : undefined) as any
                                      )
                                    }}
                                    placeholder={
                                      itemField.placeholder || 'Pick a date'
                                    }
                                  />
                                </div>
                              ) : itemField.type === 'datetime' ? (
                                <div className='w-full'>
                                  <DateTimePicker
                                    selected={
                                      itemFormField.value
                                        ? new Date(
                                            itemFormField.value as number
                                          )
                                        : undefined
                                    }
                                    onSelect={(date) => {
                                      itemFormField.onChange(
                                        (date
                                          ? date.getTime()
                                          : undefined) as any
                                      )
                                    }}
                                    placeholder={
                                      itemField.placeholder ||
                                      'Pick a date and time'
                                    }
                                    disabled={itemField.disabled}
                                  />
                                </div>
                              ) : itemField.type === 'number' ? (
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
                                  className='[appearance:textitemField] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                                  disabled={itemField.disabled}
                                  value={
                                    numberInputValuesRef.current[
                                      String(itemField.name)
                                    ] ??
                                    (itemFormField.value !== undefined &&
                                    itemFormField.value !== null
                                      ? String(itemFormField.value)
                                      : '')
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                    const itemFieldName = String(itemField.name)

                                    if (!NUMBER_INPUT_PATTERN.test(value)) {
                                      return
                                    }

                                    numberInputValuesRef.current[
                                      itemFieldName
                                    ] = value

                                    if (
                                      value === '' ||
                                      TEMPORARY_NUMBER_VALUES.has(value)
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
                                    const itemFieldName = String(itemField.name)
                                    const currentValue =
                                      numberInputValuesRef.current[
                                        itemFieldName
                                      ]
                                    if (currentValue === undefined) return

                                    if (
                                      TEMPORARY_NUMBER_VALUES.has(currentValue)
                                    ) {
                                      numberInputValuesRef.current[
                                        itemFieldName
                                      ] =
                                        itemFormField.value !== undefined &&
                                        itemFormField.value !== null
                                          ? String(itemFormField.value)
                                          : ''
                                      return
                                    }

                                    const parsedValue = Number(currentValue)
                                    if (!Number.isNaN(parsedValue)) {
                                      itemFormField.onChange(parsedValue as any)
                                      numberInputValuesRef.current[
                                        itemFieldName
                                      ] = String(parsedValue)
                                    }
                                  }}
                                />
                              ) : (
                                <Input
                                  type={itemField.type}
                                  placeholder={itemField.placeholder}
                                  step={itemField.step}
                                  min={
                                    itemField.min
                                      ? parseFloat(itemField.min)
                                      : undefined
                                  }
                                  disabled={itemField.disabled}
                                  {...itemFormField}
                                  value={String(itemFormField.value ?? '')}
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
