import { Portal } from '@headlessui/react'
import { useNetworkState } from '@react-hookz/web'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid'
import Avatar from '../participants/Avatar'
import ParticipantInfo from '../participants/ParticipantInfo'
import Dropdown from '../generic/Dropdown'
import type { SocialAnnotation } from '~/graphql'
import { useAuth } from '~/hooks/use-auth'
import { usePresence } from '~/hooks/use-presence'
import { useAnnotations } from '~/hooks/use-annotations'
import { useEvent } from '~/hooks/react'

const useAnnotationSlide = (annotation: SocialAnnotation) => {
  const slideElement = Reveal.getSlides().find(
    (slide) => {
      const highlight = Array.from(
        slide.getElementsByTagName('annotation-highlight') as HTMLCollectionOf<HTMLElement>,
      ).find((h) => (h.dataset.annotationId = annotation.id))
      return highlight ? slide.contains(highlight) : false
    },
    [annotation.id],
  )
  const indices = useMemo(() => (slideElement ? Reveal.getIndices(slideElement) : null), [slideElement])
  const navigate = useCallback(() => {
    if (indices) {
      Reveal.slide(indices.h, indices.v)
    }
  }, [indices])

  return navigate
}

export interface AnnotationTileProps {
  annotation: SocialAnnotation
  onClick?: (annotation: SocialAnnotation) => any
  onRemove?: () => any
}

export default function AnnotationTile({ annotation, onClick, ...props }: AnnotationTileProps) {
  const [{ user }] = useAuth()
  const [{ isOnline }] = usePresence()
  const { online: isBrowserOnline } = useNetworkState()
  const authored = user.id === annotation.author?.id
  const author = annotation.author ?? {
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

  const navigateToSlide = useAnnotationSlide(annotation)
  const [, { removeAnnotation }] = useAnnotations()
  const onRemove = useEvent(async () => {
    await removeAnnotation(annotation.id)
    props.onRemove?.()
  })

  return (
    <div className="w-full py-4 flex space-x-2">
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
        <div className="flex items-center mb-1 justify-between">
          <span className="inline-flex items-center">
            <span className="text-xs font-medium text-gray-900">{author.name}</span>
            <span className="text-xs text-gray-500 ml-1">
              {annotation.createdAt.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          </span>
          {authored && (
            <Dropdown
              position="top-end"
              button={
                <button className="hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center p-0.5 rounded focus:outline-none">
                  <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                  <span className="sr-only">More options</span>
                </button>
              }
            >
              <Dropdown.Item onClick={onRemove}>
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>

        <blockquote
          title="Go to slide"
          className="mb-2 p-0.5 pr-1 border-l-2 border-solid border-primary-500 bg-primary-300 bg-opacity-50 rounded hover:bg-opacity-80 transition-opacity duration-200 ease-in-out cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigateToSlide()
          }}
        >
          <p className="text-gray-500 italic text-sm">"{annotation.quote}"</p>
        </blockquote>

        <div
          className="mb-1 w-full cursor-pointer text-gray-700 hover:text-gray-900"
          onClick={() => onClick?.(annotation)}
        >
          <p className="text-sm break-words">{annotation.text}</p>
        </div>

        <div className="text-xs text-gray-500">
          {annotation.commentsCount} comment{annotation.commentsCount === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  )
}
