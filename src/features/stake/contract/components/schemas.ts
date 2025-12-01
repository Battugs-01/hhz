import { z } from 'zod'
import type { FormFieldConfig } from '@/components/ui/config-form-dialog'

export const cancelPolicySchema = z.object({
  fromDay: z.number(),
  toDay: z.number(),
  apr: z.number(),
})

export const stakeContractFormSchema = z.object({
  duration: z.number().min(1, 'Duration is required.'),
  apr: z.number().optional(),
  stakeContractName: z.string().min(1, 'Contract name is required.'),
  asset: z.string().min(1, 'Asset is required.'),
  minAmount: z.number().min(0, 'Min amount must be 0 or greater.'),
  maxAmount: z.number().min(0, 'Max amount must be 0 or greater.'),
  decimalPlaces: z.number().optional(),
  cancelPolicies: z.array(cancelPolicySchema).optional(),
})

export type StakeContractForm = z.infer<typeof stakeContractFormSchema>
export type CancelPolicyForm = z.infer<typeof cancelPolicySchema>

export const STAKE_CONTRACT_FORM_FIELDS: FormFieldConfig<StakeContractForm>[] =
  [
    {
      name: 'asset',
      label: 'Asset',
      type: 'combobox',
      placeholder: 'Search assets...',
      required: true,
      gridCols: 1,
    },
    {
      name: 'stakeContractName',
      label: 'Contract Name',
      type: 'text',
      placeholder: 'Enter contract name...',
      required: true,
      gridCols: 1,
    },
    {
      name: 'duration',
      label: 'Duration (days)',
      type: 'number',
      placeholder: 'Enter duration in days...',
      // required: true,
      gridCols: 1,
    },
    {
      name: 'apr',
      label: 'APR (%)',
      type: 'number',
      placeholder: 'Enter APR percentage...',
      gridCols: 1,
    },
    {
      name: 'minAmount',
      label: 'Min Amount',
      type: 'number',
      placeholder: 'Enter minimum amount...',
      required: true,
      gridCols: 1,
    },
    {
      name: 'maxAmount',
      label: 'Max Amount',
      type: 'number',
      placeholder: 'Enter maximum amount...',
      required: true,
      gridCols: 1,
    },
    {
      name: 'decimalPlaces',
      label: 'Decimal Places',
      type: 'number',
      placeholder: 'Enter decimal places...',
      gridCols: 1,
    },
    {
      name: 'cancelPolicies',
      label: 'Cancel Policies',
      type: 'array',
      gridCols: 1,
      addButtonLabel: 'Add Cancel Policy',
      arrayItemFields: [
        {
          name: 'fromDay',
          label: 'From Day',
          type: 'number',
          placeholder: 'Enter from day...',
          required: true,
        },
        {
          name: 'toDay',
          label: 'To Day',
          type: 'number',
          placeholder: 'Enter to day...',
          required: true,
        },
        {
          name: 'apr',
          label: 'APR (%)',
          type: 'number',
          placeholder: 'Enter APR percentage...',
          required: true,
        },
      ],
    },
  ]
