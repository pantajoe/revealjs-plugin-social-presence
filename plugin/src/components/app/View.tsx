import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import CircularButton from '../generic/CircularButton'
import SettingsView from '../../views/SettingsView'
import LectureView from '../../views/LectureView'
import ParticipantsView from '../../views/ParticipantsView'
import type { AppViewId } from '~/hooks/use-controls'
import { useControls } from '~/hooks/use-controls'
import ChatView from '~/views/ChatView'
import ProfileView from '~/views/ProfileView'
import GroupView from '~/views/GroupView'
import AnnotationView from '~/views/AnnotationView'

export default function View() {
  const [{ view }, { switchView }] = useControls()

  if (!view) return null
  return (
    <div className="h-full rounded-lg bg-white drop-shadow-lg flex-grow flex flex-col overflow-hidden">
      <div className="flex items-center justify-between py-4 px-6 flex-shrink-0">
        <h2 className="text-xl font-semibold">{view.name}</h2>
        <CircularButton color="transparent" size="md" icon={XMarkIcon} title="Close" onClick={() => switchView(null)}>
          <span className="sr-only">Close</span>
        </CircularButton>
      </div>

      <div
        className={clsx(
          'flex-grow w-full flex flex-col',
          (['chat', 'group'] as AppViewId[]).includes(view.id) ? 'overflow-y-hidden' : 'overflow-y-auto px-6 pb-4',
        )}
      >
        {view.id === 'chat' && <ChatView />}
        {view.id === 'group' && <GroupView />}
        {view.id === 'annotation' && <AnnotationView />}
        {view.id === 'participants' && <ParticipantsView />}
        {view.id === 'profile' && <ProfileView />}
        {view.id === 'settings' && <SettingsView />}
        {view.id === 'lecture-info' && <LectureView />}
      </div>
    </div>
  )
}
