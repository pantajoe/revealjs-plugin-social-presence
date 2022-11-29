import { ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import CircularButton from '../generic/CircularButton'
import CreateLectureModal from './CreateLectureModal'
import JoinLectureModal from './JoinLectureModal'
import { useAuth } from '~/hooks/use-auth'
import { useControls } from '~/hooks/use-controls'

export default function LectureControls() {
  const [, { switchView }] = useControls()
  const [{ user }] = useAuth()

  const [showCreateLectureModal, setShowCreateLectureModal] = useState(false)
  const [showJoinLectureModal, setShowJoinLectureModal] = useState(false)

  return (
    <div className="flex space-x-4 items-center">
      {user.isInstructor && (
        <>
          <CircularButton
            color="transparent"
            size="md"
            icon={PlusIcon}
            title="Create lecture"
            onClick={() => setShowCreateLectureModal(true)}
          >
            <span className="sr-only">Create lecture</span>
          </CircularButton>

          <CreateLectureModal
            open={showCreateLectureModal}
            onClose={setShowCreateLectureModal}
            onSubmit={() => switchView('lecture-info')}
          />
        </>
      )}

      <CircularButton
        color="transparent"
        size="md"
        icon={ArrowRightOnRectangleIcon}
        title="Join lecture"
        onClick={() => setShowJoinLectureModal(true)}
      >
        <span className="sr-only">Join lecture</span>
      </CircularButton>

      <JoinLectureModal
        open={showJoinLectureModal}
        onClose={setShowJoinLectureModal}
        onSubmit={() => switchView('lecture-info')}
      />
    </div>
  )
}
