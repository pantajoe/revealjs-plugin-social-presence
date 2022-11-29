import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { throttle } from 'lodash'
import { useLecture } from './use-lecture'
import { useControls } from './use-controls'
import { useWebSocket } from './use-websocket'
import type { SlideLocation } from './use-reveal-state'
import { slidesMatch, useRevealState } from './use-reveal-state'
import { useMouse } from './use-mouse'
import type { UserFragment as User } from '~/graphql'

// #region - types for context state
type UserId = string

interface MousePosition {
  x: number
  y: number
  pageWidth: number
  pageHeight: number
}

interface UserLocation {
  slide: SlideLocation
  mouse: MousePosition
}

export interface PresencePayload {
  userId: UserId
  location: Partial<UserLocation>
}

interface UserMouseLocation {
  user: User
  mouse: MousePosition
  slide: SlideLocation
}
// #endregion - types for context state

// #region - types for socket events and messages
interface ListenEventsMap {
  ['online-users']: (payload: PresencePayload[]) => any
  ['online']: (payload: PresencePayload) => any
  ['offline']: (payload: PresencePayload) => any
  ['switch-slide']: (payload: PresencePayload) => any
  ['mouse-move']: (payload: PresencePayload) => any
}

interface EmitEventsMap {
  ['online-users']: () => any
  ['switch-slide']: (payload: SlideLocation) => any
  ['mouse-move']: (payload: MousePosition) => any
}
// #endregion - types for socket events and messages

interface PresenceContextState {
  presence: number
  getSlidePresence: (slide: SlideLocation) => number
  isOnline: (userId: UserId) => boolean
  mousePositions: UserMouseLocation[]
}

interface PresenceContextActions {
  follow: (userId: UserId) => void
}

type PresenceContextValue = [PresenceContextState, PresenceContextActions]

const PresenceContext = createContext<PresenceContextValue | null>(null)

export function PresenceProvider({ children }: PropsWithChildren) {
  const [presenceMap, setPresenceMap] = useState(() => new Map<UserId, PresencePayload['location']>())
  const presence: PresenceContextState['presence'] = useMemo(() => presenceMap.size, [presenceMap])
  const getSlidePresence: PresenceContextState['getSlidePresence'] = useCallback(
    (slide) =>
      Array.from(presenceMap).filter(([, location]) => !!location.slide && slidesMatch(slide, location.slide)).length,
    [presenceMap],
  )
  const isOnline: PresenceContextState['isOnline'] = useCallback((userId) => presenceMap.has(userId), [presenceMap])

  const [{ lecture, participants }] = useLecture()
  const mousePositions: PresenceContextState['mousePositions'] = useMemo(() => {
    const positions: UserMouseLocation[] = []
    presenceMap.forEach((location, userId) => {
      if (!location.mouse || !location.slide) return
      const user = participants.find((user) => user.id === userId)
      if (!user) return

      positions.push({ user, mouse: location.mouse, slide: location.slide })
    })
    return positions
  }, [participants, presenceMap])

  const follow = useCallback(
    (userId: UserId) => {
      if (!presenceMap.has(userId)) return
      const { slide } = presenceMap.get(userId)!
      if (!slide) return
      const { horizontalIndex, verticalIndex, fragmentIndex } = slide
      Reveal.slide(horizontalIndex, verticalIndex, fragmentIndex)
    },
    [presenceMap],
  )

  const socket = useWebSocket<ListenEventsMap, EmitEventsMap>({
    pause: !lecture,
    lecture: lecture?.id ?? undefined,
    namespace: 'activity',
    path: '/presence',
  })

  // Save locations and states of other participants
  useEffect(() => {
    if (!socket) return
    socket.on('online-users', (payload) => {
      const map = new Map<UserId, PresencePayload['location']>()
      payload.forEach((item) => map.set(item.userId, item.location))
      setPresenceMap(map)
    })
    socket.on('online', (payload) => {
      setPresenceMap((map) => {
        const newMap = new Map(map)
        newMap.set(payload.userId, payload.location)
        return newMap
      })
    })
    socket.on('offline', (payload) => {
      setPresenceMap((map) => {
        const newMap = new Map(map)
        newMap.delete(payload.userId)
        return newMap
      })
    })
    socket.on('switch-slide', (payload) => {
      setPresenceMap((map) => {
        const newMap = new Map(map)
        const location = newMap.get(payload.userId)
        if (!location) return map
        newMap.set(payload.userId, { ...location, slide: payload.location.slide })
        return newMap
      })
    })

    return () => {
      socket.off('online-users')
      socket.off('online')
      socket.off('offline')
      socket.off('switch-slide')
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    socket.emit('online-users')
  }, [socket])

  // Transmit reveal.js slide location
  const { slide: currentSlide } = useRevealState()
  useEffect(() => {
    if (!socket) return
    socket.emit('switch-slide', currentSlide)
  }, [socket, currentSlide])

  // Conditionally show mouse cursors
  const [{ showCursors, zenMode }] = useControls()
  useEffect(() => {
    if (!socket || !showCursors || zenMode) return

    socket.on(
      'mouse-move',
      throttle((payload) => {
        setPresenceMap((map) => {
          const newMap = new Map(map)
          const location = newMap.get(payload.userId)
          if (!location) return map
          newMap.set(payload.userId, { ...location, mouse: payload.location.mouse })
          return newMap
        })
      }, 50),
    )

    return () => {
      socket.off('mouse-move')
    }
  }, [socket, showCursors, zenMode])

  // Transmit mouse cursor location
  const cursorPosition = useMouse()
  useEffect(() => {
    if (!socket) return
    socket.emit('mouse-move', cursorPosition)
  }, [socket, cursorPosition])

  return (
    <PresenceContext.Provider
      value={[
        {
          presence,
          getSlidePresence,
          isOnline,
          mousePositions,
        },
        {
          follow,
        },
      ]}
    >
      {children}
    </PresenceContext.Provider>
  )
}

export const usePresence = () => {
  const context = useContext(PresenceContext)
  if (!context) throw new Error('usePresence must be used within PresenceProvider')
  return context
}
