import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authService } from '@/services'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = Readonly<{
  session?: string
  username?: string
  redirect?: string
  className?: string
}>

export function OtpForm({
  session,
  username,
  redirect,
  className,
  ...props
}: OtpFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const verifyMutation = useMutation({
    mutationFn: authService.verifyMFA,
    onSuccess: async (data) => {
      if (data.body) {
        // Бүх token-уудыг хадгалах
        auth.saveTokens({
          accessToken: data.body.accessToken,
          idToken: data.body.idToken,
          refreshToken: data.body.refreshToken,
        })

        // AdminUser-ийг response-оос шууд авах
        if (data.body.adminUser) {
          auth.setUser(data.body.adminUser)
        }

        navigate({ to: redirect || '/', replace: true })
        toast.success('Амжилттай нэвтэрлээ')
      } else {
        toast.error('Token авах боломжгүй байна')
      }
    },
    onError: (err: Error) => {
      const errorMessage = err.message || 'OTP код буруу байна'
      toast.error(errorMessage)
      console.error('OTP verification error:', err)
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!session || !username) {
      toast.error('Session эсвэл username байхгүй байна. Дахин нэвтэрнэ үү.')
      navigate({ to: '/sign-in', replace: true })
      return
    }

    verifyMutation.mutate({
      session,
      username,
      code: data.otp,
    })
  }

  // Session эсвэл username байхгүй бол form-ийг disable хийх
  const isFormDisabled = !session || !username

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isFormDisabled && (
          <p className='text-destructive text-center text-sm'>
            Session эсвэл username байхгүй байна. Дахин нэвтэрнэ үү.
          </p>
        )}
        <Button
          className='mt-2'
          disabled={
            otp.length < 6 || verifyMutation.isPending || isFormDisabled
          }
        >
          {verifyMutation.isPending ? (
            <Loader2 className='animate-spin' />
          ) : null}
          Verify
        </Button>
      </form>
    </Form>
  )
}
