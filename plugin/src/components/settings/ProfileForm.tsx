import { useForm } from 'react-hook-form'
import { UserIcon } from '@heroicons/react/20/solid'
import { useCallback, useMemo } from 'react'
import Input from '../generic/Input'
import Button from '../generic/Button'
import ColorPicker, { DEFAULT_COLORS } from '../generic/ColorPicker'
import ImageInput from '../generic/ImageInput'
import Textarea from '../generic/Textarea'
import { useAuth } from '~/hooks/use-auth'
import { useUpdateProfileMutation } from '~/graphql'
import { handleFormError } from '~/utils'

interface ProfileInputs {
  name: string
  bio: string
  color: string
  avatar?: FileList
}

export default function ProfileForm() {
  const [{ user }, { setUser }] = useAuth()

  const defaultValues: ProfileInputs = useMemo(
    () => ({
      name: user?.name ?? '',
      bio: user?.bio ?? '',
      color: user?.profileColor ?? DEFAULT_COLORS[0],
      avatar: undefined,
    }),
    [user?.name, user?.profileColor, user?.bio],
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInputs>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const [, updateProfile] = useUpdateProfileMutation()
  const onSubmit = useCallback(
    async ({ avatar, ...inputs }: ProfileInputs) => {
      const { data } = await updateProfile({ ...inputs, avatar: avatar?.[0] })
      const { updateProfile: user } = data ?? {}
      if (user) {
        setUser(user)
        reset(defaultValues)
      }
    },
    [updateProfile, setUser, reset, defaultValues],
  )

  return (
    <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4 pb-6 px-2">
      <div className="flex items-center space-x-3">
        <ImageInput
          imageSize="sm"
          rounded
          placeholder={
            user.avatarUrl ?? (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="text-gray-500 h-5/6 w-5/6" />
              </div>
            )
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
        <div>
          <p className="text-sm font-medium text-gray-700 truncate" title={watch('name')}>
            {watch('name')}
          </p>
          <p className="text-xs font-medium text-gray-500 truncate" title={user.email}>
            {user.email}
          </p>
        </div>
      </div>

      <Input label="Name" type="text" {...register('name', { required: true })} error={errors.name?.message} />
      <Textarea label="Bio" rows={4} className="resize-none" {...register('bio')} />
      <ColorPicker
        size="sm"
        label="Profile color"
        value={watch('color')}
        onChange={(color) => setValue('color', color, { shouldDirty: true })}
        className="justify-center"
      />
      <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-full mt-8">
        Update Profile
      </Button>
    </form>
  )
}
