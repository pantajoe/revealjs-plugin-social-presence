import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Handler } from 'mitt'
import { nanoid } from 'nanoid'
import Notification, { NotificationEventManager } from '~/components/generic/Notification'
import type { Events, NotificationProps } from '~/components/generic/Notification'

export const useNotifications = ({ delay }: { delay?: number } = {}) => {
  const show = useCallback(
    (props: NotificationProps) => {
      NotificationEventManager.emit('show', { delay, ...props })
    },
    [delay],
  )

  const close = useCallback((id: string) => {
    NotificationEventManager.emit('close', { id })
  }, [])

  const success = useCallback(
    (message: string, options: Partial<Omit<NotificationProps, 'id' | 'type' | 'message'>> = {}) => {
      show({ ...options, message, type: 'success', id: nanoid(8) })
    },
    [show],
  )

  const error = useCallback(
    (message: string, options: Partial<Omit<NotificationProps, 'id' | 'type' | 'message'>> = {}) => {
      show({ ...options, message, type: 'error', id: nanoid(8) })
    },
    [show],
  )

  const warning = useCallback(
    (message: string, options: Partial<Omit<NotificationProps, 'id' | 'type' | 'message'>> = {}) => {
      show({ ...options, message, type: 'warning', id: nanoid(8) })
    },
    [show],
  )

  const info = useCallback(
    (message: string, options: Partial<Omit<NotificationProps, 'id' | 'type' | 'message'>> = {}) => {
      show({ ...options, message, type: 'info', id: nanoid(8) })
    },
    [show],
  )

  const value = useMemo(
    () => ({
      success,
      error,
      warning,
      info,
      show,
      close,
    }),
    [success, error, warning, info, show, close],
  )

  return value
}

export const NotificationContainer = () => {
  const [notification, setNotification] = useState<NotificationProps | null>(null)

  useEffect(() => {
    const onShow: Handler<Events['show']> = (payload) => {
      setNotification(payload)
    }
    const onClose: Handler<Events['close']> = (_payload) => {
      setNotification(null)
    }
    NotificationEventManager.on('show', onShow)
    NotificationEventManager.on('close', onClose)

    return () => {
      NotificationEventManager.off('show', onShow)
      NotificationEventManager.off('close', onClose)
    }
  }, [])

  return (
    <div className="fixed bottom-0 inset-x-0 100">
      {notification && (
        <div className="w-full pb-2">
          <Notification {...notification} />
        </div>
      )}
    </div>
  )
}
