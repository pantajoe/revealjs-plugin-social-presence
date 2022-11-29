import { useMemo } from 'react'
import clsx from 'clsx'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  type?: AlertType
  /** max ~30 chars */
  title?: string
  /** around ~60-100 chars */
  message: string
}

export default function Alert({ type = 'info', message, title }: AlertProps) {
  const containerCssClasses = useMemo(
    () =>
      clsx('rounded-md p-4', {
        'bg-green-50': type === 'success',
        'bg-red-50': type === 'error',
        'bg-yellow-50': type === 'warning',
        'bg-blue-50': type === 'info',
      }),
    [type],
  )

  const titleCssClasses = useMemo(
    () =>
      clsx('text-sm font-medium mb-2', {
        'text-green-800': type === 'success',
        'text-red-800': type === 'error',
        'text-yellow-800': type === 'warning',
        'text-blue-800': type === 'info',
      }),
    [type],
  )

  const messageCssClasses = useMemo(
    () =>
      clsx('text-sm', {
        'text-green-700': type === 'success',
        'text-red-700': type === 'error',
        'text-yellow-700': type === 'warning',
        'text-blue-700': type === 'info',
      }),
    [type],
  )

  const icon = useMemo(() => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
    }
  }, [type])

  return (
    <div className={containerCssClasses}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          {title && <h3 className={titleCssClasses}>{title}</h3>}
          <div className={messageCssClasses}>{message}</div>
        </div>
      </div>
    </div>
  )
}
