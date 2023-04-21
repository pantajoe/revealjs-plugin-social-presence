import { UserCircleIcon as UserCircleActiveIcon, UserIcon } from '@heroicons/react/20/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useState } from 'react'
import AnnotationEnvironment from './components/annotation/AnnotationEnvironment'
import Controls from './components/app/Controls'
import View from './components/app/View'
import SignInModal from './components/auth/SignInModal'
import CircularButton from './components/generic/CircularButton'
import LectureControls from './components/lecture/LectureControls'
import CursorCanvas from './components/presence/CursorCanvas'
import ParticipantCounts from './components/presence/ParticipantCounts'
import { useAuth } from './hooks/use-auth'
import { useControls } from './hooks/use-controls'
import { useLecture } from './hooks/use-lecture'
import { usePluginConfig } from './hooks/use-plugin-config'

export default function App() {
  const [{ isLoggedIn }] = useAuth()
  const [{ view, showCursors, zenMode, showOnlyGroupCursors, showAnnotationHighlights }, { switchView }] = useControls()
  const config = usePluginConfig()
  const [{ lecture }] = useLecture()
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className={clsx('absolute z-60 top-0 left-0 py-4 pl-4 w-[360px]', view && 'h-screen max-h-screen')}>
      {isLoggedIn ? (
        lecture ? (
          <>
            {!zenMode && showAnnotationHighlights && config.annotations && <AnnotationEnvironment />}
            <div className="flex flex-col h-full">
              <Controls />
              <View />
              {config.cursors && (showCursors || showOnlyGroupCursors) && !zenMode && <CursorCanvas />}
              {!zenMode && <ParticipantCounts />}
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <LectureControls>
              <CircularButton
                color="transparent"
                size="md"
                icon={view?.id === 'profile' ? UserCircleActiveIcon : UserCircleIcon}
                title="Profile"
                onClick={() => switchView('profile')}
              >
                <span className="sr-only">Profile</span>
              </CircularButton>
            </LectureControls>
            <View />
          </div>
        )
      ) : (
        <>
          <CircularButton title="Login" color="transparent" icon={UserIcon} onClick={() => setShowLoginModal(true)}>
            <span className="sr-only">Login</span>
          </CircularButton>
          <SignInModal open={showLoginModal} onClose={setShowLoginModal} />
        </>
      )}
    </div>
  )
}
