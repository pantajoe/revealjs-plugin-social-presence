import { ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import Button from '../generic/Button'
import CreateGroupModal from './CreateGroupModal'
import JoinGroupModal from './JoinGroupModal'

export default function GroupPlaceholder() {
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)

  return (
    <div className="h-full w-full flex flex-col justify-center items-center space-y-4 px-6 pb-4">
      <Button
        type="button"
        color="white"
        className="w-full"
        onClick={() => setShowJoinGroupModal(true)}
        icon={ArrowRightOnRectangleIcon}
      >
        Join group
      </Button>

      <JoinGroupModal open={showJoinGroupModal} onClose={setShowJoinGroupModal} />

      <Button
        type="button"
        color="primary"
        className="w-full"
        onClick={() => setShowCreateGroupModal(true)}
        icon={PlusIcon}
      >
        Create group
      </Button>

      <CreateGroupModal open={showCreateGroupModal} onClose={setShowCreateGroupModal} />
    </div>
  )
}
