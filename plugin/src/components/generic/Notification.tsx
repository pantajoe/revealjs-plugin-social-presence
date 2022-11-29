import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { Transition } from '@headlessui/react'
import mitt from 'mitt'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Events = {
  show: NotificationProps
  close: { id: string }
}

export const NotificationEventManager = mitt<Events>()

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationProps {
  id: string
  type?: NotificationType
  delay?: number
  /** around ~60-100 chars */
  message: string
  /** max ~30 chars */
  shortMessage?: string
}

const DEFAULT_DELAY = 5_000

export default function Notification({
  id,
  type = 'info',
  delay = DEFAULT_DELAY,
  message,
  shortMessage,
}: NotificationProps) {
  const [active, setActive] = useState(true)

  const onClose = useCallback(() => {
    setActive(false)
    setTimeout(() => NotificationEventManager.emit('close', { id }), 500)
  }, [id])

  useEffect(() => {
    const timeout = setTimeout(onClose, delay)
    return () => clearTimeout(timeout)
  }, [delay, onClose])

  const containerCssClasses = useMemo(
    () =>
      clsx('w-11/12 mx-auto mb-2 rounded-lg shadow-lg', {
        'bg-green-600': type === 'success',
        'bg-red-600': type === 'error',
        'bg-yellow-600': type === 'warning',
        'bg-blue-600': type === 'info',
      }),
    [type],
  )

  const iconHolderCssClasses = useMemo(
    () =>
      clsx('flex text-white p-2 rounded-lg', {
        'bg-green-700': type === 'success',
        'bg-red-700': type === 'error',
        'bg-yellow-700': type === 'warning',
        'bg-blue-700': type === 'info',
      }),
    [type],
  )

  const icon = useMemo(() => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6" />
      case 'error':
        return <XCircleIcon className="h-6 w-6" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6" />
      case 'info':
        return <InformationCircleIcon className="h-6 w-6" />
    }
  }, [type])

  const closeButtonCssClasses = useMemo(
    () =>
      clsx('-mr-1 flex p-2 rounded-md focus:outline-none sm:-mr-2 transition ease-in-out duration-150', {
        'focus:bg-green-500 hover:bg-green-500': type === 'success',
        'focus:bg-red-500 hover:bg-red-500': type === 'error',
        'focus:bg-yellow-500 hover:bg-yellow-500': type === 'warning',
        'focus:bg-blue-500 hover:bg-blue-500': type === 'info',
      }),
    [type],
  )

  return (
    <Transition
      appear
      show={active}
      as="div"
      className={containerCssClasses}
      enter="transition ease-out duration-150"
      enterFrom="translate-y-full opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-out duration-150"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-full opacity-0"
    >
      <div className="mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className={iconHolderCssClasses}>{icon}</span>

            <p className="ml-3 text-white text-sm md:text-base text-center w-full ">
              {Boolean(shortMessage) && <span className="md:hidden">{shortMessage}</span>}
              <span className={clsx(shortMessage ? 'hidden md:inline' : 'inline')}>{message}</span>
            </p>
          </div>

          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button type="button" className={closeButtonCssClasses} aria-label="Dismiss" onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  )
}
