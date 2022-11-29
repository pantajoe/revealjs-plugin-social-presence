import { useForm } from 'react-hook-form'
import { UserIcon } from '@heroicons/react/20/solid'
import Input from '../generic/Input'
import Button from '../generic/Button'
import Alert from '../generic/Alert'
import ColorPicker, { DEFAULT_COLORS } from '../generic/ColorPicker'
import ImageInput from '../generic/ImageInput'
import Textarea from '../generic/Textarea'
import { useAuth } from '~/hooks/use-auth'
import { useNotifications } from '~/hooks/use-notifications'
import { useRegisterMutation } from '~/graphql'
import { handleFormError } from '~/utils'

interface RegistrationInputs {
  name: string
  bio: string
  email: string
  password: string
  color: string
  avatar?: FileList
}

interface RegisterFormProps {
  onSubmit: () => void
}

export default function RegisterForm({ onSubmit: onRegister }: RegisterFormProps) {
  const [, { login }] = useAuth()
  const { success } = useNotifications()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted, isSubmitSuccessful, isSubmitting },
  } = useForm<RegistrationInputs>({
    defaultValues: {
      name: '',
      bio: '',
      email: '',
      password: '',
      color: DEFAULT_COLORS[0],
      avatar: undefined,
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const [, registerMutation] = useRegisterMutation()
  const onSubmit = async ({ avatar, ...inputs }: RegistrationInputs) => {
    const { data } = await registerMutation({ ...inputs, avatar: avatar?.[0] })
    const { register: user } = data ?? {}
    if (user) {
      onRegister()
      await login({ email: inputs.email, password: inputs.password })
      success(`Welcome, ${user.name}!`)
    } else throw new Error('Registration failed')
  }

  return (
    <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-6">
      <div className="flex space-x-4">
        <div className="flex flex-col space-y-4 px-2">
          <ImageInput
            rounded
            placeholder={
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="text-gray-500 h-5/6 w-5/6" />
              </div>
            }
            disabled={isSubmitting}
            error={errors.avatar ? 'Please upload a file up to 5 MB' : ''}
            {...register('avatar', {
              validate: (files) => {
                if (!files?.[0]) return true
                return files[0].size / 1024 < 5000
              },
            })}
          />
        </div>

        <div className="space-y-4 px-2 flex-1">
          <Input label="Email" type="email" {...register('email', { required: true })} error={errors.email?.message} />
          <Input
            label="Password"
            type="password"
            {...register('password', { required: true, minLength: 8, maxLength: 32 })}
            error={errors.password?.message}
          />
          <Input label="Name" type="text" {...register('name', { required: true })} error={errors.name?.message} />
          <Textarea label="Bio" rows={4} className="resize-none" {...register('bio')} />
          <ColorPicker
            size="md"
            label="Profile color"
            value={watch('color')}
            onChange={(color) => setValue('color', color, { shouldDirty: true })}
          />
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        Register
      </Button>

      {isSubmitted && !isSubmitSuccessful && (
        <Alert type="error" title="Error" message="This email address is already in use" />
      )}
    </form>
  )
}
