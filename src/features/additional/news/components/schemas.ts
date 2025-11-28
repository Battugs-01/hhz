import { z } from 'zod'
import type { FormFieldConfig } from '@/components/ui/config-form-dialog'

export const newsFormSchema = z.object({
  nameMon: z.string().min(1, 'Name (Mon) is required.'),
  nameEng: z.string().min(1, 'Name (Eng) is required.'),
  shortMon: z.string().optional(),
  shortEng: z.string().optional(),
  descriptionMon: z.string().min(1, 'Description (Mon) is required.'),
  descriptionEng: z.string().min(1, 'Description (Eng) is required.'),
  category: z.enum(['News', 'Announcement']),
  imageUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

export type NewsForm = z.infer<typeof newsFormSchema>

export const NEWS_FORM_FIELDS: FormFieldConfig<NewsForm>[] = [
  {
    name: 'nameMon',
    label: 'Name Mon',
    type: 'text',
    placeholder: 'Text',
    required: true,
    gridCols: 1,
  },
  {
    name: 'nameEng',
    label: 'Name Eng',
    type: 'text',
    placeholder: 'Text',
    required: true,
    gridCols: 1,
  },
  {
    name: 'shortMon',
    label: 'Short Mon',
    type: 'text',
    placeholder: 'Text',
    gridCols: 1,
  },
  {
    name: 'shortEng',
    label: 'Short Eng',
    type: 'text',
    placeholder: 'Text',
    gridCols: 1,
  },
  {
    name: 'descriptionMon',
    label: 'Description Mon',
    type: 'html',
    placeholder: 'Enter HTML description in Mongolian',
    required: true,
    gridCols: 1,
  },
  {
    name: 'descriptionEng',
    label: 'Description Eng',
    type: 'html',
    placeholder: 'Enter HTML description in English',
    required: true,
    gridCols: 1,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'News', value: 'News' },
      { label: 'Announcement', value: 'Announcement' },
    ],
    placeholder: 'Select category...',
    required: true,
    gridCols: 1,
  },
  {
    name: 'imageUrl',
    label: 'Image',
    type: 'image-upload',
    gridCols: 1,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    placeholder: 'Select status...',
    required: true,
    gridCols: 1,
  },
]
