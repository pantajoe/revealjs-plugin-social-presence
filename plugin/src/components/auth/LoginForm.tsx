import { useForm } from 'react-hook-form'
import Input from '../generic/Input'
import Button from '../generic/Button'
import Alert from '../generic/Alert'
import { useAuth } from '~/hooks/use-auth'
import { useNotifications } from '~/hooks/use-notifications'
import { handleFormError } from '~/utils'

interface LoginFormProps {
  onSubmit: () => void
}

export default function LoginForm({ onSubmit: onLogin }: LoginFormProps) {
  const [, { login }] = useAuth()
  const { success } = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    const user = await login({ email, password })
    if (user) {
      onLogin()
      success(`Welcome back, ${user.name}!`)
    } else throw new Error('Login failed')
  }

  return (
    <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4">
      <Input label="Email" type="email" {...register('email', { required: true })} error={errors.email?.message} />
      <Input
        label="Password"
        type="password"
        {...register('password', { required: true })}
        error={errors.password?.message}
      />
      <Button type="submit" loading={isSubmitting} className="w-full">
        Login
      </Button>

      {isSubmitted && !isSubmitSuccessful && (
        <Alert type="error" title="Login failed" message="Please try again with correct credentials" />
      )}
    </form>
  )
}
