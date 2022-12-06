import { useEffect, useState } from 'react'
import { BellIcon, BellSlashIcon } from '@heroicons/react/20/solid'
import CircularButton from '../generic/CircularButton'
import NumberBadge from './NumberBadge'
import { AppViews, useControls } from '~/hooks/use-controls'
import { usePresence } from '~/hooks/use-presence'
import { useChat } from '~/hooks/use-messages'
import { useEvent } from '~/hooks/react'
import { useGroupChat } from '~/hooks/use-group-chat'
import { useAnnotations } from '~/hooks/use-annotations'
import { useAnnotationHighlightClick } from '~/hooks/use-annotation'

export default function Controls() {
  const [zenButtonHovered, setZenButtonHovered] = useState(false)

  const [{ view: currentView, zenMode, showAnnotationHighlights }, { switchView, toggle }] = useControls()
  const [{ presence }] = usePresence()

  const [unreadMessages, setUnreadMessages] = useState(0)
  const [{ events: chatEvents }] = useChat()
  const onMessageReceived = useEvent(() => {
    if (currentView?.id === 'chat') return
    setUnreadMessages((count) => count + 1)
  })
  useEffect(() => {
    chatEvents.on('message-received', onMessageReceived)

    return () => {
      chatEvents.off('message-received', onMessageReceived)
    }
  }, [chatEvents, onMessageReceived])

  const [unreadGroupMessages, setUnreadGroupMessages] = useState(0)
  const [{ events: groupChatEvents }] = useGroupChat()
  const onGroupMessageReceived = useEvent(() => {
    if (currentView?.id === 'group') return
    setUnreadGroupMessages((count) => count + 1)
  })
  useEffect(() => {
    groupChatEvents.on('message-received', onGroupMessageReceived)

    return () => {
      groupChatEvents.off('message-received', onGroupMessageReceived)
    }
  }, [groupChatEvents, onGroupMessageReceived])

  useAnnotationHighlightClick(!zenMode && showAnnotationHighlights)
  const [unreadAnnotations, setUnreadAnnotations] = useState(0)
  const [{ events: annotationEvents }] = useAnnotations()
  const onAnnotationActivity = useEvent(() => {
    if (currentView?.id === 'annotation') return
    setUnreadAnnotations((count) => count + 1)
  })
  useEffect(() => {
    annotationEvents.on('annotation:created', onAnnotationActivity)
    annotationEvents.on('comment:created', onAnnotationActivity)
    return () => {
      annotationEvents.off('annotation:created', onAnnotationActivity)
      annotationEvents.off('comment:created', onAnnotationActivity)
    }
  }, [annotationEvents, onAnnotationActivity])

  return (
    <div className="flex space-x-4 items-center mb-4 flex-shrink-0">
      {zenMode ? (
        <CircularButton
          color="transparent"
          size="md"
          icon={zenButtonHovered ? BellIcon : BellSlashIcon}
          title="Disable Zen mode"
          onClick={() => toggle('zenMode')}
          onMouseEnter={() => setZenButtonHovered(true)}
          onMouseLeave={() => setZenButtonHovered(false)}
        >
          <span className="sr-only">Disable Zen mode</span>
        </CircularButton>
      ) : (
        AppViews.filter(({ enabled }) => enabled()).map((view) => (
          <div key={view.id} className="relative">
            <CircularButton
              color="transparent"
              size="md"
              icon={view.id === currentView?.id ? view.activeIcon : view.icon}
              title={view.name}
              onClick={() => {
                switchView(view)
                if (view.id === 'chat') setUnreadMessages(0)
                if (view.id === 'group') setUnreadGroupMessages(0)
                if (view.id === 'annotation') setUnreadAnnotations(0)
              }}
            >
              <span className="sr-only">{view.name}</span>
            </CircularButton>

            {view.id === 'participants' && <NumberBadge>{presence + 1}</NumberBadge>}
            {view.id === 'chat' && unreadMessages > 0 && <NumberBadge>{unreadMessages}</NumberBadge>}
            {view.id === 'group' && unreadGroupMessages > 0 && <NumberBadge>{unreadGroupMessages}</NumberBadge>}
            {view.id === 'annotation' && unreadAnnotations > 0 && <NumberBadge>{unreadAnnotations}</NumberBadge>}
          </div>
        ))
      )}
    </div>
  )
}
