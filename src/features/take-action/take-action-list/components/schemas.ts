import { z } from 'zod'
import type { FormFieldConfig } from '@/components/ui/config-form-dialog'

export const takeActionFormSchema = z.object({
    actionId: z.string(),   
    createdAt: z.number().optional(),
    content: z.object({
        mainTitle: z.string(),
        mainDesc: z.string(),
        deepLink: z.string().optional(),
        sub_content: z
        .array(
            z.object({
            title: z.string(),
            desc: z.string(),
            status: z.string().optional(),
            type: z.string(),
            value: z.string().optional()
            })
        )
        .optional()
    }),
    contentType: z.enum(['EMAIL', 'PHONE', 'MARK_DOWN']),
    updatedAt: z.number().optional(),
    status: z.enum(['active', 'inactive']),
    type: z.string()
})

export type takeActionForm = z.infer<typeof takeActionFormSchema>

export const TAKE_ACTION_FORM_FIELDS: FormFieldConfig<takeActionForm>[] = [
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { label: 'Verification', value: 'verification' },
      { label: 'Quiz', value: 'quiz' },
    ],
    placeholder: 'Select type...',
    required: true,
    gridCols: 1,
  },

  {
    name: 'contentType',
    label: 'Content Type',
    type: 'select',
    options: [
      { label: 'Email', value: 'EMAIL' },
      { label: 'Phone', value: 'PHONE' },
      { label: 'Mark Down', value: 'MARK_DOWN' },
    ],
    placeholder: 'Select content type...',
    required: true,
    gridCols: 1,
  },

  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'InActive', value: 'inactive' },
    ],
    placeholder: 'Select status...',
    required: true,
    gridCols: 1,
  },

  {
    name: 'content',
    label: 'Content',
    type: 'array',
    required: true,
    gridCols: 1,
    arrayItemFields: [
      {
        name: 'mainTitle',
        label: 'Main Title',
        type: 'text',
        placeholder: 'Please enter main title...',
        required: true,
      },
      {
        name: 'mainDesc',
        label: 'Main Description',
        type: 'textarea',
        placeholder: 'Please enter main description...',
        required: true,
      },

      {
        name: 'deepLink',
        label: 'Deep Link',
        type: 'text',
        placeholder: 'Please enter deep link...',
        required: true,
      },

      {
        name: 'sub_content',
        label: 'Sub Content',
        type: 'array',
        required: true,
        gridCols: 1,
        addButtonLabel: 'Add Sub Content Item',
        arrayItemFields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'Please enter title...',
            required: true,
          },
          {
            name: 'desc',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Please enter description...',
            required: true,
          },
          {
            name: 'type',
            label: 'Type',
            type: 'select',
            options: [
              { label: 'Quiz', value: 'quiz' },
              { label: 'Check', value: 'check' },
            ],
            placeholder: 'Select sub type...',
            required: true,
          }
        ]
      },
    ],
  },
]
