import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../generic/Button'
import Input from '../generic/Input'
import { useGroup } from '~/hooks/use-group'
import { handleFormError } from '~/utils'

interface UpdateGroupInputs {
  name: string
}

export default function GroupForm() {
  const [{ group }, { updateGroup }] = useGroup()
  const defaultValues: UpdateGroupInputs = useMemo(() => ({ name: group?.name ?? '' }), [group?.name])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateGroupInputs>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ name }: UpdateGroupInputs) => {
    await updateGroup(name)
    reset({ ...defaultValues, name })
  }

  return (
    <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4 py-6 px-2">
      <Input
        label="Name"
        type="text"
        {...register('name', { required: true, minLength: 3, maxLength: 52 })}
        error={errors.name?.message}
      />
      <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-full mt-8">
        Update group
      </Button>
    </form>
  )
}
