import { useForm } from 'react-hook-form'
import Button from '../generic/Button'
import Input from '../generic/Input'
import type { ModalProps } from '../generic/Modal'
import Modal from '../generic/Modal'
import { useNotifications } from '~/hooks/use-notifications'
import { useGroup } from '~/hooks/use-group'
import { handleFormError } from '~/utils'

export interface CreateGroupModalProps extends Pick<ModalProps, 'open' | 'onClose'> {
  onSubmit?: () => void
}

interface CreateGroupInputs {
  name: string
}

export default function CreateGroupModal({ onSubmit: onCreate, ...modalProps }: CreateGroupModalProps) {
  const [, { createGroup }] = useGroup()
  const { success } = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupInputs>({
    defaultValues: {
      name: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ name }: CreateGroupInputs) => {
    await createGroup(name)
    onCreate?.()
    modalProps?.onClose?.(false)
    success(`Group "${name}" created!`)
  }

  return (
    <Modal {...modalProps} size="md" stretch>
      <Modal.Title as="h3" className="font-bold text-gray-900 text-lg">
        Create Group
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
            Create group
          </Button>
        </form>
      </Modal.Content>
    </Modal>
  )
}
