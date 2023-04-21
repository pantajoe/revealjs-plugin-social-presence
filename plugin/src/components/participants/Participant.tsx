import { ArrowUturnLeftIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useEffect, useMemo, useState } from 'react'
import { Portal } from '@headlessui/react'
import { usePopper } from 'react-popper'
import { useNetworkState } from '@react-hookz/web'
import Dropdown from '../generic/Dropdown'
import Avatar from './Avatar'
import ParticipantInfo from './ParticipantInfo'
import type { UserFragment as User } from '~/graphql'
import { useAuth } from '~/hooks/use-auth'
import { useLecture } from '~/hooks/use-lecture'
import { usePresence } from '~/hooks/use-presence'

export interface ParticipantProps {
  participant: User
  noControls?: boolean
  onClick?: () => void
}

export default function Participant({ participant, onClick, noControls = false }: ParticipantProps) {
  const [{ user }] = useAuth()
  const [, { kickParticipant }] = useLecture()
  const [{ isOnline }] = usePresence()
  const name = participant.id === user.id ? `${participant.name} (You)` : participant.name
  const role = participant.isInstructor ? 'Instructor' : 'Student'
  const { online: isBrowserOnline } = useNetworkState()
  const online = useMemo(
    () => (participant.id === user.id ? isBrowserOnline : isOnline(participant.id)),
    [isBrowserOnline, isOnline, participant.id, user.id],
  )

  const [hovering, setHovering] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  useEffect(() => {
    if (!hovering) {
      setShowInfo(false)
      return
    }

    const timeout = setTimeout(() => {
      setShowInfo(true)
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [hovering])

  const [referenceElement, setReferenceElement] = useState<HTMLSpanElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    strategy: 'absolute',
    placement: 'top-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  })

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center group cursor-pointer" onClick={onClick}>
        <div>
          <Avatar
            ref={setReferenceElement}
            size="sm"
            name={name}
            color={participant.profileColor}
            src={participant.avatarUrl}
            status={online ? 'online' : 'offline'}
            className="cursor-pointer"
            onMouseOver={() => setHovering(true)}
            onMouseOut={() => setHovering(false)}
          />
          {showInfo && (
            <Portal>
              <ParticipantInfo
                ref={setPopperElement}
                {...attributes.popper}
                participant={participant}
                className="z-90"
                style={styles.popper}
              />
            </Portal>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{name}</p>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{role}</p>
        </div>
      </div>
      {!noControls && user.isInstructor && user.id !== participant.id && (
        <Dropdown
          position="bottom-end"
          button={
            <button className="hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center p-1 rounded focus:outline-none">
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
              <span className="sr-only">More options</span>
            </button>
          }
        >
          <Dropdown.Item onClick={() => kickParticipant(participant.id)}>
            <ArrowUturnLeftIcon className="w-4 h-4" />
            <span>Kick participant</span>
          </Dropdown.Item>
        </Dropdown>
      )}
    </div>
  )
}
