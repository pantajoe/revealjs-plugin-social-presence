import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef, useMemo } from 'react'
import { useNetworkState } from '@react-hookz/web'
import QuoteIcon from '../icons/QuoteIcon'
import Avatar from './Avatar'
import type { UserFragment as User } from '~/graphql'
import { useAuth } from '~/hooks/use-auth'
import { usePresence } from '~/hooks/use-presence'

export interface ParticipantInfoProps extends ComponentProps<'div'> {
  participant: User
}

export default forwardRef<HTMLDivElement, ParticipantInfoProps>(function ParticipantInfo(
  { participant, className, ...props },
  ref,
) {
  const [{ user }] = useAuth()
  const [{ isOnline }] = usePresence()
  const name = participant.id === user.id ? `${participant.name} (You)` : participant.name
  const role = participant.isInstructor ? 'Instructor' : 'Student'
  const { online: isBrowserOnline } = useNetworkState()
  const online = useMemo(
    () => (participant.id === user.id ? isBrowserOnline : isOnline(participant.id)),
    [isBrowserOnline, isOnline, participant.id, user.id],
  )

  return (
    <div ref={ref} className={clsx(className, 'w-60 rounded-lg drop-shadow-lg bg-white p-4')} {...props}>
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <Avatar
            size="lg"
            name={participant.name}
            src={participant.avatarUrl}
            color={participant.profileColor}
            status={online ? 'online' : 'offline'}
          />
        </div>
        <div className="flex-1 ml-4">
          <p className="text-base font-medium text-gray-700">{name}</p>
          <p className="text-sm font-medium text-gray-500">{role}</p>
        </div>
      </div>
      {participant.bio && (
        <div className="relative">
          <blockquote className="text-base italic text-gray-700">
            <QuoteIcon className="absolute -top-1 -left-1 w-8 h-8 text-gray-200 -z-[1]" aria-hidden="true" />
            <p>"{participant.bio}"</p>
          </blockquote>
        </div>
      )}
    </div>
  )
})
