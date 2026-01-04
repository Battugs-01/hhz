import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authService } from '@/services'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Main } from '@/components/layout/main'
import { PasswordInput } from '@/components/password-input'

const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*]/,
        'Password must contain at least one special character (!@#$%^&*)'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>

export function UpdatePassword() {
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: UpdatePasswordForm) => {
      return await authService.updatePassword({
        oldPassword: data.oldPassword,
        password: data.password,
      })
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Password updated successfully!')
        setShowSuccess(true)
        form.reset()
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate({ to: '/' })
        }, 2000)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update password')
    },
  })

  const onSubmit = (data: UpdatePasswordForm) => {
    mutation.mutate(data)
  }

  return (
    <Main className='flex flex-1 items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Update Password</CardTitle>
          <CardDescription>
            Change your account password. Make sure to use a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccess ? (
            <div className='rounded-md bg-green-50 p-4 dark:bg-green-900/20'>
              <p className='text-sm text-green-800 dark:text-green-200'>
                Your password has been updated successfully! Redirecting to
                dashboard...
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='oldPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Enter your current password'
                          disabled={mutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Enter your new password'
                          disabled={mutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder='Confirm your new password'
                          disabled={mutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex gap-2 pt-2'>
                  <Button
                    type='submit'
                    className='flex-1'
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Updating...' : 'Update Password'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => navigate({ to: '/' })}
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </Main>
  )
}
