import { ArrowLeftOnRectangleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import Button from '../components/generic/Button'
import ProfileForm from '../components/settings/ProfileForm'
import { useAuth } from '~/hooks/use-auth'
import { useControls } from '~/hooks/use-controls'
import { useDeleteProfileMutation } from '~/graphql'
import AlertModal from '~/components/generic/AlertModal'

export default function ProfileView() {
  const [, { logout }] = useAuth()
  const [, { switchView }] = useControls()

  const [, deleteProfile] = useDeleteProfileMutation()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <ProfileForm />

      <div className="space-y-4">
        <Button
          type="button"
          color="white"
          className="w-full"
          onClick={() => {
            logout()
            switchView(null)
          }}
          icon={ArrowLeftOnRectangleIcon}
        >
          Logout
        </Button>

        <Button
          type="button"
          color="red"
          className="w-full"
          onClick={() => setShowDeleteConfirmation(true)}
          icon={TrashIcon}
        >
          Delete profile
        </Button>

        <AlertModal
          type="error"
          title="Delete profile"
          open={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          submitText="Delete profile"
          onSubmit={async () => {
            await deleteProfile({})
            await logout()
            switchView(null)
          }}
        >
          Are you sure you want to delete your profile? All your messages will remain, but the association to you will
          be removed. This action cannot be undone.
        </AlertModal>
      </div>
    </div>
  )
}
