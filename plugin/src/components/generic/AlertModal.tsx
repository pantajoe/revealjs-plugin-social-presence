import clsx from 'clsx'
import { CheckIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'
import Button from './Button'
import type { ModalProps } from './Modal'
import Modal from './Modal'

export type DialogType = 'info' | 'success' | 'error'

export interface AlertModalProps extends Omit<ModalProps, 'stretch' | 'blank' | 'size'> {
  type?: DialogType
  title: string
  submitText?: string
  onSubmit?: () => void
}

export default function AlertModal({
  type = 'info',
  title,
  children,
  submitText,
  onSubmit,
  ...modalProps
}: AlertModalProps) {
  const iconWrapperClasses = clsx([
    'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10',
    {
      'bg-green-100': type === 'success',
      'bg-blue-100': type === 'info',
      'bg-red-100': type === 'error',
    },
  ])

  const iconClasses = clsx([
    'h-6 w-6',
    {
      'text-green-600': type === 'success',
      'text-blue-600': type === 'info',
      'text-red-600': type === 'error',
    },
  ])

  const hasCancelButton = typeof onSubmit !== 'undefined'
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Modal stretch initialFocus={buttonRef} {...modalProps}>
      <div className="sm:flex sm:items-start">
        <div className={iconWrapperClasses}>
          {type === 'success' && <CheckIcon className={iconClasses} aria-hidden="true" />}
          {type === 'info' && <InformationCircleIcon className={iconClasses} aria-hidden="true" />}
          {type === 'error' && <ExclamationTriangleIcon className={iconClasses} aria-hidden="true" />}
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Modal.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </Modal.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{children}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button
          ref={hasCancelButton ? buttonRef : undefined}
          color={type === 'error' ? 'red' : 'primary'}
          className="w-full sm:ml-3 sm:w-auto"
          onClick={() => {
            onSubmit?.()
            modalProps.onClose?.(false)
          }}
        >
          {submitText || 'OK'}
        </Button>
        {hasCancelButton && (
          <Button
            ref={buttonRef}
            type="button"
            color="white"
            className="mt-3 w-full sm:mt-0 sm:w-auto"
            onClick={() => modalProps.onClose?.(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    </Modal>
  )
}
