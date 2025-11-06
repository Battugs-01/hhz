import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { authService } from '@/services'
import { Loader2, LogIn } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(6, 'Password must be at least 6 characters long'),
})

type UserAuthFormProps = Readonly<{
  redirectTo?: string
  className?: string
}>

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      if (!data.body) {
        toast.error('Алдаа гарлаа')
        return
      }

      // MFA challenge шалгах
      if (
        'challengeName' in data.body &&
        data.body.challengeName === 'SOFTWARE_TOKEN_MFA'
      ) {
        // Session болон username байгаа эсэхийг шалгах
        if (
          'session' in data.body &&
          'username' in data.body &&
          data.body.session &&
          data.body.username
        ) {
          // OTP хуудас руу navigate хийх, session болон username дамжуулах
          navigate({
            to: '/otp',
            search: {
              session: data.body.session,
              username: data.body.username,
              redirect: redirectTo,
            },
            replace: true,
          })
          return
        } else {
          toast.error('MFA challenge-д session эсвэл username байхгүй байна')
          return
        }
      }

      // Энгийн login (token байвал)
      if ('token' in data.body && data.body.token) {
        auth.saveToken(data.body.token)

        try {
          const userInfo = await authService.getUserInfo()
          if (userInfo.body) {
            auth.setUser(userInfo.body)
          }
          navigate({ to: redirectTo || '/', replace: true })
          toast.success('Амжилттай нэвтэрлээ')
        } catch (error) {
          console.error('Failed to fetch user info:', error)
          toast.error('Хэрэглэгчийн мэдээлэл авч чадсангүй')
        }
      } else {
        toast.error('Token авах боломжгүй байна')
      }
    },
    onError: (err: Error) => {
      // Error message-ийг харуулах
      const errorMessage = err.message || 'Алдаа гарлаа'
      toast.error(errorMessage)
      console.error('Login error:', err)
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    loginMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <Loader2 className='animate-spin' />
          ) : (
            <LogIn />
          )}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
