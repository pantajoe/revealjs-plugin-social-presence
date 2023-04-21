import type { ComponentProps, MouseEventHandler } from 'react'
import { Fragment, useRef, useState } from 'react'
import clsx from 'clsx'
import { Menu, Portal, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import type { Placement } from '@popperjs/core'

type ButtonProps = Omit<ComponentProps<'button'>, 'type' | 'disabled' | 'className'> & { onClick: MouseEventHandler }
export type DropdownItemProps = ButtonProps & {
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

const DropdownItem = ({ disabled = false, className, children, onClick, ...props }: DropdownItemProps) => {
  const cssClasses = (active: boolean) => {
    return clsx(
      className,
      'w-full py-2 px-4 flex items-center space-x-2 focus:outline-none text-xs rounded text-gray-500 hover:text-gray-700 transition-colors duration-200 ease-linear',
      active && 'bg-primary-100',
    )
  }

  return (
    <Menu.Item disabled={disabled}>
      {({ active }) => (
        <button
          type="button"
          {...props}
          className={cssClasses(active)}
          onClick={(e) => {
            e.stopPropagation()
            onClick(e)
          }}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  )
}

DropdownItem.displayName = 'Drodown.Item'

export interface DropdownProps {
  button: React.ReactNode
  children: React.ReactNode
  className?: string
  position?: Placement
}

const Dropdown = ({ button, children, position = 'bottom-start', className }: DropdownProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>()
  const popperElementRef = useRef<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'absolute',
    placement: position,
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
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <div ref={setReferenceElement} className="flex">
            <Menu.Button as={Fragment}>{button}</Menu.Button>
          </div>

          <Portal>
            <div
              ref={popperElementRef}
              style={{ ...styles.popper, zIndex: 1000007 }}
              {...attributes.popper}
              onClick={(e) => e.stopPropagation()}
            >
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                beforeEnter={() => setPopperElement(popperElementRef.current)}
                afterLeave={() => setPopperElement(null)}
              >
                <Menu.Items
                  as="div"
                  static
                  className={clsx(
                    className,
                    'bg-white border border-slate-100 space-y-1 rounded-md z-90 min-w-[11rem] overflow-hidden p-1 shadow-md',
                  )}
                >
                  {children}
                </Menu.Items>
              </Transition>
            </div>
          </Portal>
        </>
      )}
    </Menu>
  )
}

Dropdown.Item = DropdownItem

export default Dropdown
