import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../generic/Button'
import Input from '../generic/Input'
import { useLecture } from '~/hooks/use-lecture'
import { handleFormError } from '~/utils'

interface UpdateLectureInputs {
  name: string
}

export default function LectureForm() {
  const [{ lecture }, { updateLecture }] = useLecture()
  const defaultValues: UpdateLectureInputs = useMemo(() => ({ name: lecture?.name ?? '' }), [lecture?.name])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateLectureInputs>({
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ name }: UpdateLectureInputs) => {
    await updateLecture(name)
    reset({ ...defaultValues, name })
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4 py-6 px-2">
      <Input
        label="Name"
        type="text"
        {...register('name', { required: true, minLength: 3, maxLength: 52 })}
        error={errors.name?.message}
      />
      <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-full mt-8">
        Update lecture
      </Button>
    </form>
  )
}
