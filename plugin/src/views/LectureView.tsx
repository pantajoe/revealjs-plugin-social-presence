import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import Button from '../components/generic/Button'
import AlertModal from '../components/generic/AlertModal'
import JoinLectureModal from '../components/lecture/JoinLectureModal'
import LectureForm from '../components/lecture/LectureForm'
import LectureSummary from '../components/lecture/LectureSummary'
import { useAuth } from '~/hooks/use-auth'
import { useLecture } from '~/hooks/use-lecture'
import CreateLectureModal from '~/components/lecture/CreateLectureModal'

export default function LectureView() {
  const [{ lecture }, { leaveLecture, deleteLecture }] = useLecture()
  const [{ user }] = useAuth()
  const isAdmin = lecture!.owner.id === user.id

  const [showCreateLectureModal, setShowCreateLectureModal] = useState(false)
  const [showSwitchLectureModal, setShowSwitchLectureModal] = useState(false)
  const [showDeleteLectureModal, setShowDeleteLectureModal] = useState(false)

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full">
        <LectureSummary />
        {user.isInstructor && <LectureForm />}
      </div>

      <div className="space-y-6">
        {user.isInstructor && (
          <>
            <Button
              type="button"
              color="white"
              className="w-full"
              onClick={() => setShowCreateLectureModal(true)}
              icon={PlusIcon}
            >
              Create lecture
            </Button>
            <CreateLectureModal open={showCreateLectureModal} onClose={setShowCreateLectureModal} />
          </>
        )}

        <Button
          type="button"
          color="white"
          className="w-full"
          onClick={() => setShowSwitchLectureModal(true)}
          icon={ArrowRightOnRectangleIcon}
        >
          Switch lecture
        </Button>

        <JoinLectureModal open={showSwitchLectureModal} onClose={setShowSwitchLectureModal} />

        <Button
          type="button"
          color="red"
          className="w-full"
          onClick={() => setShowDeleteLectureModal(true)}
          icon={ArrowLeftOnRectangleIcon}
        >
          {isAdmin ? 'Delete lecture' : 'Leave lecture'}
        </Button>

        <AlertModal
          type="error"
          open={showDeleteLectureModal}
          onClose={setShowDeleteLectureModal}
          title={isAdmin ? 'Delete lecture' : 'Leave lecture'}
          submitText={isAdmin ? 'Delete' : 'Leave'}
          onSubmit={() => {
            if (isAdmin) deleteLecture()
            else leaveLecture()
          }}
        >
          {isAdmin
            ? 'Are you sure you want to delete this lecture? All data regarding the lecture will be lost.'
            : 'Are you sure you want to leave this lecture? You can join later again if you wish to.'}
        </AlertModal>
      </div>
    </div>
  )
}
