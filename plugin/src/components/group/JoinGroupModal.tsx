import { useForm } from 'react-hook-form'
import Button from '../generic/Button'
import Input from '../generic/Input'
import type { ModalProps } from '../generic/Modal'
import Modal from '../generic/Modal'
import { useNotifications } from '~/hooks/use-notifications'
import { useGroup } from '~/hooks/use-group'
import { handleFormError } from '~/utils'

const GROUP_TOKEN_PATTERN = /^[0-9A-Z]{6}$/

export interface JoinGroupModalProps extends Pick<ModalProps, 'open' | 'onClose'> {
  onSubmit?: () => void
}

interface JoinGroupInputs {
  groupId: string
}

export default function JoinGroupModal({ onSubmit: onJoin, ...modalProps }: JoinGroupModalProps) {
  const [, { joinGroup }] = useGroup()
  const { success, error } = useNotifications()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinGroupInputs>({
    defaultValues: {
      groupId: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const onSubmit = async ({ groupId }: JoinGroupInputs) => {
    const group = await joinGroup(groupId)
    onJoin?.()
    modalProps?.onClose?.(false)
    if (group) success(`Group "${group.name}" joined!`)
    else {
      error('Group not found!')
      throw new Error('Group not found')
    }
  }

  return (
    <Modal {...modalProps} size="md" stretch>
      <Modal.Title as="h3" className="font-bold text-gray-900 text-lg">
        Join Group
      </Modal.Title>

      <Modal.Content>
        <form onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4">
          <Input
            label="Group identifier"
            type="text"
            {...register('groupId', {
              required: true,
              pattern: {
                value: GROUP_TOKEN_PATTERN,
                message: 'Please provide a token made of 6 uppercase letters and numbers',
              },
            })}
            error={errors.groupId?.message}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Join group
          </Button>
        </form>
      </Modal.Content>
    </Modal>
  )
}
