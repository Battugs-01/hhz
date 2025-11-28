import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { type User } from '@/services'
import { AlertTriangle, MailPlus } from 'lucide-react'
import { toast } from 'sonner'
import type { StandardDialogProps } from '@/lib/dialog-types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BaseFormDialog } from '@/components/ui/base-form-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PasswordInput } from '@/components/password-input'
import {
  inviteFormSchema,
  userFormSchema,
  type InviteForm,
  type UserForm,
} from './schemas'

function UserFormDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<User>) {
  const isEdit = !!data
  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: isEdit
      ? { ...data, password: '', confirmPassword: '', isEdit }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const mutation = useMutation({
    mutationFn: async (values: UserForm) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return values
    },
    onSuccess: () => {
      toast.success(
        isEdit ? 'User updated successfully!' : 'User created successfully!'
      )
      form.reset()
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save user')
    },
  })

  const onSubmit = (values: UserForm) => {
    mutation.mutate(values)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <BaseFormDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
          onClose()
        }
      }}
      formId='user-form'
      onSubmit={form.handleSubmit(onSubmit)}
      maxWidth='lg'
      title={isEdit ? 'Edit User' : 'Add New User'}
      description={isEdit ? 'Update the user here.' : 'Create new user here.'}
      contentClassName='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'
      formClassName='space-y-4 px-0.5'
      submitButton={{
        text: 'Save changes',
        loading: mutation.isPending,
      }}
      cancelButton={{
        text: 'Cancel',
        show: mutation.isPending,
      }}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='John'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Doe'
                  className='col-span-4'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder='john_doe'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='john.doe@gmail.com'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder='+123456789'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Role</FormLabel>
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                placeholder='Select a role'
                className='col-span-4'
                items={roles.map((role) => ({
                  label: role.label,
                  value: role.value,
                }))}
              />
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='e.g., S3cur3P@ssw0rd'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
              <FormLabel className='col-span-2 text-end'>
                Confirm Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={!isPasswordTouched}
                  placeholder='e.g., S3cur3P@ssw0rd'
                  className='col-span-4'
                  {...field}
                />
              </FormControl>
              <FormMessage className='col-span-4 col-start-3' />
            </FormItem>
          )}
        />
      </Form>
    </BaseFormDialog>
  )
}

function InviteUserDialog({ open, onClose, onSuccess }: StandardDialogProps) {
  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: { email: '', role: '', desc: '' },
  })

  const mutation = useMutation({
    mutationFn: async (values: InviteForm) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return values
    },
    onSuccess: () => {
      toast.success('User invited successfully!')
      form.reset()
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to invite user')
    },
  })

  const onSubmit = (values: InviteForm) => {
    mutation.mutate(values)
  }

  return (
    <BaseFormDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset()
          onClose()
        }
      }}
      formId='invite-form'
      onSubmit={form.handleSubmit(onSubmit)}
      maxWidth='md'
      title={
        <span className='flex items-center gap-2'>
          <MailPlus /> Invite User
        </span>
      }
      description='Invite new user to join your team by sending them an email invitation. Assign a role to define their access level.'
      formClassName='space-y-4'
      submitButton={{
        text: 'Invite',
        loading: mutation.isPending,
        disabled: mutation.isPending,
      }}
      cancelButton={{
        text: 'Cancel',
        show: mutation.isPending,
      }}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='eg: john.doe@gmail.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <SelectDropdown
                defaultValue={field.value}
                onValueChange={field.onChange}
                placeholder='Select a role'
                items={roles.map((role) => ({
                  label: role.label,
                  value: role.value,
                }))}
              />
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name='desc'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  className='resize-none'
                  placeholder='Add a personal note to your invitation (optional)'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </BaseFormDialog>
  )
}

function DeleteUserDialog({
  open,
  onClose,
  onSuccess,
  data,
}: StandardDialogProps<User>) {
  const [value, setValue] = useState('')

  if (!data) return null

  const mutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: () => {
      toast.success('User deleted successfully!')
      setValue('')
      onSuccess?.()
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user')
    },
  })

  const handleDelete = () => {
    if (value.trim() !== data.username) return
    mutation.mutate()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setValue('')
          onClose()
        }
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== data.username || mutation.isPending}
      isLoading={mutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{data.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>{data.role.toUpperCase()}</span> from
            the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter username to confirm deletion.'
              disabled={mutation.isPending}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}

export const UserDialogs = {
  Form: UserFormDialog,
  Invite: InviteUserDialog,
  Delete: DeleteUserDialog,
}
