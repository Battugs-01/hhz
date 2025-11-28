import { z } from 'zod'
import type { FormFieldConfig } from '@/components/ui/config-form-dialog'

export const stakeAssetFormSchema = z.object({
  asset: z.string().min(1, 'Asset is required.'),
  image: z.string().optional(), // Set automatically from selected coin
  maxSize: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  termsAndConditions: z.string().optional(),
  stakeAssetTitle: z.string().optional(),
  stakeImage: z.string().optional(), // Uploaded image
})

export type StakeAssetForm = z.infer<typeof stakeAssetFormSchema>

export const STAKE_ASSET_FORM_FIELDS: FormFieldConfig<StakeAssetForm>[] = [
  {
    name: 'asset',
    label: 'Asset',
    type: 'combobox',
    placeholder: 'Search coins...',
    required: true,
    gridCols: 1,
  },
  {
    name: 'stakeAssetTitle',
    label: 'Stake Asset Title',
    type: 'text',
    placeholder: 'Enter stake asset title...',
    gridCols: 1,
  },
  {
    name: 'maxSize',
    label: 'Max Size',
    type: 'number',
    placeholder: 'Enter max size...',
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
    gridCols: 1,
  },
  {
    name: 'termsAndConditions',
    label: 'Terms and Conditions',
    type: 'markdown',
    placeholder: 'Enter terms and conditions...',
    gridCols: 1,
  },
  {
    name: 'stakeImage',
    label: 'Stake Image',
    type: 'image-upload',
    gridCols: 1,
  },
]
