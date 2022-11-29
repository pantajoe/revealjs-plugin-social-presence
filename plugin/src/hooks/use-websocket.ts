import { useSafeState } from '@react-hookz/web'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { useCredentials } from '~/config/auth.config'
import { usePluginConfig } from '~/hooks/use-plugin-config'

export interface UseWebSocketOptions {
  pause?: boolean
  namespace?: string
  path?: string
  lecture?: string
  query?: Record<string, unknown>
}

export type EventsMap = Record<string, any>

export const useWebSocket = <ListenEvents extends EventsMap = EventsMap, EmitEvents extends EventsMap = ListenEvents>({
  pause = false,
  namespace,
  path,
  lecture,
  query,
}: UseWebSocketOptions) => {
  const { socketUrl } = usePluginConfig()
  const { auth, refresh: refreshAuth } = useCredentials()

  const createSocket = useCallback(() => {
    return io(namespace ? `${socketUrl}/${namespace}` : socketUrl, {
      auth: {
        token: auth?.token,
      },
      transports: ['websocket'],
      path,
      query: {
        ...(query || {}),
        ...(lecture ? { lecture } : {}),
      },
    })
  }, [namespace, socketUrl, auth?.token, path, query, lecture])

  const [socket, setSocket] = useState<Socket<ListenEvents, EmitEvents> | null>(null)
  const [isReady, setIsReady] = useSafeState(false)
  useEffect(() => {
    if (pause) return

    const newSocket = createSocket()
    newSocket.on('ack', () => {
      setIsReady(true)
      newSocket?.off('ack')
    })
    setSocket(newSocket)
    return () => {
      setIsReady(false)
      newSocket.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSocket, pause])

  useEffect(() => {
    if (socket?.connected) return

    refreshAuth()
  }, [socket?.connected, refreshAuth])

  const returnValue = useMemo(() => (isReady ? socket : null), [isReady, socket])

  return returnValue
}
