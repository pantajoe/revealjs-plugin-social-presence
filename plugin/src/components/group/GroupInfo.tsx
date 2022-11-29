import { ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid'
import { forwardRef, useState } from 'react'
import AlertModal from '../generic/AlertModal'
import Button from '../generic/Button'
import GroupForm from './GroupForm'
import GroupSummary from './GroupSummary'
import { useGroup } from '~/hooks/use-group'

export default forwardRef<HTMLDivElement, {}>(function GroupInfo(props, ref) {
  const [, { leaveGroup }] = useGroup()
  const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false)

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-between">
      <div className="w-full">
        <GroupSummary />
        <GroupForm />
      </div>

      <div className="w-full">
        <Button
          type="button"
          color="red"
          className="w-full"
          onClick={() => setShowLeaveGroupModal(true)}
          icon={ArrowLeftOnRectangleIcon}
        >
          Leave group
        </Button>

        <AlertModal
          type="error"
          open={showLeaveGroupModal}
          onClose={setShowLeaveGroupModal}
          title="Leave group"
          submitText="Leave"
          onSubmit={leaveGroup}
        >
          Are you sure you want to leave this group? If you are its last member, the group and all its content will be
          deleted.
        </AlertModal>
      </div>
    </div>
  )
})
