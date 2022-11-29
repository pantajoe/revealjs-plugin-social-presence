import { Portal } from '@headlessui/react'
import { useNetworkState } from '@react-hookz/web'
import { useEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import Avatar from '../participants/Avatar'
import ParticipantInfo from '../participants/ParticipantInfo'
import type { CommentFragment as Comment } from '~/graphql'
import { useAuth } from '~/hooks/use-auth'
import { usePresence } from '~/hooks/use-presence'

export interface CommentProps {
  comment: Comment
}

export default function CommentBox({ comment }: CommentProps) {
  const [{ user }] = useAuth()
  const [{ isOnline }] = usePresence()
  const { online: isBrowserOnline } = useNetworkState()
  const authored = user.id === comment.author?.id
  const author = comment.author ?? {
    __typename: 'User',
    name: 'Deleted user',
    bio: '',
    email: '',
    id: '',
    isInstructor: false,
    isStudent: false,
    profileColor: '#71717a',
  }
  const online = useMemo(
    () => (authored ? isBrowserOnline : isOnline(author.id)),
    [isBrowserOnline, isOnline, author.id, authored],
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
    <div className="w-full py-2 flex space-x-2">
      <div className="flex-shrink-0">
        <Avatar
          ref={setReferenceElement}
          size="xs"
          name={author.name}
          src={author.avatarUrl}
          color={author.profileColor}
          className="cursor-pointer"
          status={online ? 'online' : 'offline'}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
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

      <div className="flex-grow p-1">
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-gray-900">{author.name}</span>
          <span className="text-xs text-gray-500 ml-1">
            {comment.createdAt.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </div>

        <div className="mb-1 w-full cursor-pointer text-gray-700 hover:text-gray-900">
          <p className="text-sm break-words">{comment.text}</p>
        </div>
      </div>
    </div>
  )
}
