import { ArrowUturnLeftIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { Portal } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import { truncate } from 'lodash'
import CircularButton from '../generic/CircularButton'
import Avatar from '../participants/Avatar'
import ParticipantInfo from '../participants/ParticipantInfo'
import Tooltip from '../generic/Tooltip'
import type { MessageFragment as Message } from '~/graphql'
import { useAuth } from '~/hooks/use-auth'

export interface ChatBubbleProps {
  message: Message
  highlighted?: boolean
  onReplyTo?: (message: Message) => any
  onParentMessageClick?: () => any
}

export default function ChatBubble({ message, highlighted = false, onReplyTo, onParentMessageClick }: ChatBubbleProps) {
  const [{ user }] = useAuth()
  const authored = user.id === message.author?.id
  const author = message.author ?? {
    __typename: 'User',
    name: 'Deleted user',
    bio: '',
    email: '',
    id: '',
    isInstructor: false,
    isStudent: false,
    profileColor: '#71717a',
  }
  const parentMessage = truncate(message.parent?.text, { length: 100 })

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
    <div id={`message-${message.id}`} className={clsx('flex mt-2 group', authored ? 'flex-row-reverse' : 'flex-row')}>
      <div className={clsx('flex max-w-[80%] min-w-[40%]', authored ? 'justify-end' : 'justify-start')}>
        {!authored && (
          <div className="flex-shrink-0">
            <Avatar
              ref={setReferenceElement}
              size="sm"
              name={author.name}
              color={author.profileColor}
              src={author?.avatarUrl}
              className="cursor-pointer flex-shrink-0 mt-2 mr-2"
              onMouseOver={() => setHovering(true)}
              onMouseOut={() => setHovering(false)}
            />
            {showInfo && (
              <Portal>
                <ParticipantInfo
                  ref={setPopperElement}
                  {...attributes.popper}
                  participant={author}
                  className="z-40"
                  style={styles.popper}
                />
              </Portal>
            )}
          </div>
        )}

        <div
          className={clsx(
            'p-1 rounded flex-grow drop-shadow transition-colors duration-200 ease-in-out',
            authored && !highlighted ? 'bg-primary-300' : 'bg-white',
            highlighted && 'bg-gray-300',
          )}
        >
          {!authored && (
            <div className="text-xs mb-0.5" style={{ color: author.profileColor }}>
              {author.name}
            </div>
          )}
          {parentMessage && (
            <div
              className="mb-1 rounded bg-primary-300 bg-opacity-50 border-l-4 border-solid border-primary-500 p-1 cursor-pointer"
              onClick={() => onParentMessageClick?.()}
            >
              <p className="text-xs break-words text-gray-600">{parentMessage}</p>
            </div>
          )}
          <div className="p-1 pb-0">
            <p
              className="text-sm break-words text-gray-900"
              dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }}
            />
          </div>
          <div id={`${message.id}-date`} className="ml-auto w-fit text-2xs mt-0.5 text-black text-opacity-50 pb-1 pr-1">
            {message.createdAt.toLocaleTimeString(undefined, { timeStyle: 'short' })}
          </div>
          <Tooltip target={`${message.id}-date`} position="bottom" size="sm" theme="light">
            {message.createdAt.toLocaleString()}
          </Tooltip>
        </div>
      </div>

      <div
        className={clsx(
          'flex-grow self-center flex items-center h-full',
          authored ? 'justify-end mr-2' : 'justify-start ml-2',
        )}
        onDoubleClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onReplyTo?.(message)
        }}
      >
        <CircularButton
          size="2xs"
          color="transparent"
          icon={ArrowUturnLeftIcon}
          className="opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100"
          onClick={() => onReplyTo?.(message)}
        >
          <span className="sr-only">Reply</span>
        </CircularButton>
      </div>
    </div>
  )
}
