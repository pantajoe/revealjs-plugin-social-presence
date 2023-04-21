import type { ReactNode, RefObject } from 'react'
import { Fragment, createContext, useContext } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalProps {
  size?: ModalSize
  open: boolean
  blank?: boolean
  stretch?: boolean
  onClose: (close: false) => void
  children: ReactNode
  initialFocus?: RefObject<HTMLElement>
}

interface ModalContextValue extends Pick<ModalProps, 'open' | 'onClose'> {}
const ModalContext = createContext<ModalContextValue>({ open: false, onClose: () => {} })
const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a Modal')
  }
  return context
}

const Modal = ({ size = 'sm', open, onClose, children, initialFocus, blank = false, stretch = false }: ModalProps) => {
  return (
    <ModalContext.Provider value={{ open, onClose }}>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-80" initialFocus={initialFocus} onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-90 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={clsx(
                    'relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all',
                    {
                      'px-4 pt-5 pb-4 sm:my-8 sm:align-middle sm:max-w-lg sm:w-auto sm:p-6': size === 'sm',
                      'px-6 pt-8 pb-6 sm:my-8 sm:align-middle sm:max-w-xl sm:w-auto sm:p-6': size === 'md',
                      'px-8 pt-12 pb-8 sm:my-8 sm:align-middle sm:max-w-[50rem] sm:w-auto sm:p-6': size === 'lg',
                      'px-8 pt-12 pb-8 sm:my-8 sm:align-middle sm:max-w-[64rem] sm:w-auto sm:p-6': size === 'xl',
                    },
                    blank && '!p-0',
                    stretch && '!w-full',
                  )}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </ModalContext.Provider>
  )
}

const ModalTitle = Dialog.Title
ModalTitle.displayName = 'Modal.Title'
Modal.Title = ModalTitle

export interface ModalContentProps {
  children: ReactNode
}
const ModalContent = ({ children }: ModalContentProps) => {
  return <div className="p-4">{children}</div>
}
ModalContent.displayName = 'Modal.Content'
Modal.Content = ModalContent

const ModalCloseButton = () => {
  const { onClose } = useModalContext()

  return (
    <button
      type="button"
      onClick={() => onClose(false)}
      className="absolute top-0 -right-12 flex justify-center items-center bg-white rounded-full h-9 w-9 p-0 shadow-none border-none hover:shadow-none outline-none focus:outline-none"
    >
      <XMarkIcon className="h-5 w-5 text-neutral-700" />
    </button>
  )
}
ModalCloseButton.displayName = 'Modal.CloseButton'
Modal.CloseButton = ModalCloseButton

export default Modal
