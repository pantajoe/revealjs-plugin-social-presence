import { useForm } from 'react-hook-form'
import Button from '../generic/Button'
import Input from '../generic/Input'
import type { ModalProps } from '../generic/Modal'
import Modal from '../generic/Modal'
import { useNotifications } from '~/hooks/use-notifications'
import { useLecture } from '~/hooks/use-lecture'
import { handleFormError } from '~/utils'

export interface CreateLectureModalProps extends Pick<ModalProps, 'open' | 'onClose'> {
  onSubmit?: () => void
}

interface CreateLectureInputs {
  name: string
}

export default function CreateLectureModal({ onSubmit: onCreate, ...modalProps }: CreateLectureModalProps) {
  const [, { createLecture }] = useLecture()
  const { success } = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLectureInputs>({
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ name }: CreateLectureInputs) => {
    await createLecture(name)
    onCreate?.()
    modalProps?.onClose?.(false)
    success(`Lecture "${name}" created!`)
  }

  return (
    <Modal {...modalProps} size="md" stretch>
      <Modal.Title as="h3" className="font-bold text-gray-900 text-lg">
        Create Lecture
      </Modal.Title>

      <Modal.Content>
        <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4">
          <Input
            label="Name"
            type="text"
            {...register('name', { required: true, minLength: 3, maxLength: 52 })}
            error={errors.name?.message}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Create lecture
          </Button>
        </form>
      </Modal.Content>
    </Modal>
  )
}
