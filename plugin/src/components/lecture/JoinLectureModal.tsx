import { useForm } from 'react-hook-form'
import Button from '../generic/Button'
import Input from '../generic/Input'
import type { ModalProps } from '../generic/Modal'
import Modal from '../generic/Modal'
import { useNotifications } from '~/hooks/use-notifications'
import { useLecture } from '~/hooks/use-lecture'
import { handleFormError } from '~/utils'

const LECTURE_ID_PATTERN = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

export interface JoinLectureModalProps extends Pick<ModalProps, 'open' | 'onClose'> {
  onSubmit?: () => void
}

interface JoinLectureInputs {
  lectureId: string
}

export default function JoinLectureModal({ onSubmit: onJoin, ...modalProps }: JoinLectureModalProps) {
  const [, { joinLecture }] = useLecture()
  const { success, error } = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinLectureInputs>({
    defaultValues: {
      lectureId: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ lectureId }: JoinLectureInputs) => {
    const lecture = await joinLecture(lectureId)
    onJoin?.()
    modalProps?.onClose?.(false)
    if (lecture) success(`Lecture "${lecture.name}" joined!`)
    else {
      error('Lecture not found!')
      throw new Error('Lecture not found')
    }
  }

  return (
    <Modal {...modalProps} size="md" stretch>
      <Modal.Title as="h3" className="font-bold text-gray-900 text-lg">
        Join Lecture
      </Modal.Title>

      <Modal.Content>
        <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4">
          <Input
            label="Lecture identifier"
            type="text"
            {...register('lectureId', {
              required: true,
              pattern: { value: LECTURE_ID_PATTERN, message: 'Invalid identifier. It must be a UUID' },
            })}
            error={errors.lectureId?.message}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Join lecture
          </Button>
        </form>
      </Modal.Content>
    </Modal>
  )
}
