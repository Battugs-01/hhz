import { FormFieldConfig } from '@/components/ui/config-form-dialog'
import type { FilterField } from '@/components/filter-panel'
import { AdminForm } from './schemas'

export const FILTER_KEYS = ['role'] as const
export const ADMIN_FORM_FIELDS: FormFieldConfig<AdminForm>[] = [
  {
    name: 'firstName',
    label: 'Нэр',
    type: 'text',
    placeholder: 'Жишээ нь: Бат',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Овог',
    type: 'text',
    placeholder: 'Жишээ нь: Доржийн',
    required: true,
  },
  {
    name: 'email',
    label: 'И-мэйл',
    type: 'email',
    placeholder: 'example@email.com',
    required: true,
  },
  {
    name: 'role',
    label: 'Үүрэг',
    type: 'select',
    required: true,
    options: [
      { label: 'Супер Админ', value: 'super_admin' },
      { label: 'Админ', value: 'admin' },
      { label: 'Менежер', value: 'manager' },
      { label: 'Таг', value: 'tag' },
      { label: 'Эдийн засагч', value: 'economist' },
      { label: 'Нягтлан бодогч', value: 'accountant' },
    ],
  },
  {
    name: 'password',
    label: 'Нууц үг',
    type: 'password',
    placeholder: 'Жишээ нь: S3cur3P@ssw0rd',
    required: true,
  },
  {
    name: 'confirmPassword',
    label: 'Нууц үг давтах',
    type: 'password',
    placeholder: 'Жишээ нь: S3cur3P@ssw0rd',
    required: true,
  },
]
export const ADMIN_FILTER_FIELDS: FilterField[] = [
  {
    key: 'role',
    label: 'Үүрэг',
    type: 'select',
    placeholder: 'Үүрэг сонгох...',
    options: [
      { label: 'Супер Админ', value: 'super_admin' },
      { label: 'Админ', value: 'admin' },
      { label: 'Менежер', value: 'manager' },
      { label: 'Таг', value: 'tag' },
      { label: 'Эдийн засагч', value: 'economist' },
      { label: 'Нягтлан бодогч', value: 'accountant' },
    ],
  },
  {
    key: 'dateRange',
    label: 'Огнооны хүрээ',
    type: 'date-range',
    placeholder: 'Огноогоор шүүх',
  },
]

export const QUERY_KEYS = {
  ADMIN_LIST: 'admin-list',
  ADMIN_DETAIL: 'admin-detail',
} as const

export const TABLE_CONFIG = {
  ID: 'admin-table',
  EXPORT_FILE_NAME: 'admins.xlsx',
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
  SEARCH_KEY: 'email',
  SEARCH_PLACEHOLDER: 'И-мэйл, нэрээр хайх...',
} as const
