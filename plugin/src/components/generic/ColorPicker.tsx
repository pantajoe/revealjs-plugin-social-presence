import { useMemo, useState } from 'react'
import { Menu, Portal } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { upperFirst } from 'lodash'
import { usePopper } from 'react-popper'
import type { StrictModifiers } from '@popperjs/core'
import Label from './Label'
import { TailwindColorMap, hexToTailwindColor } from '~/utils'

export const DEFAULT_COLORS = Object.values(TailwindColorMap)

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  colors?: string[]
  className?: string
  value: string | null | undefined
  onChange: (value: string) => void
}

export default function ColorPicker({
  label,
  colors = DEFAULT_COLORS,
  className = '',
  value,
  onChange,
  size = 'md',
}: Props) {
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>()
  const offsetModifier: StrictModifiers = useMemo(
    () => ({
      name: 'offset',
      options: {
        offset: ({ popper }) => [-(popper.width / 2), 8],
      },
    }),
    [],
  )
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'absolute',
    placement: 'bottom-start',
    modifiers: [offsetModifier],
  })

  const ringColorClasses = (color: string) => {
    const tailwindColor = hexToTailwindColor(color)

    return clsx({
      'ring-zinc-300': tailwindColor === 'zinc',
      'ring-red-300': tailwindColor === 'red',
      'ring-orange-300': tailwindColor === 'orange',
      'ring-amber-300': tailwindColor === 'amber',
      'ring-lime-300': tailwindColor === 'lime',
      'ring-emerald-300': tailwindColor === 'emerald',
      'ring-teal-300': tailwindColor === 'teal',
      'ring-cyan-300': tailwindColor === 'cyan',
      'ring-blue-300': tailwindColor === 'blue',
      'ring-indigo-300': tailwindColor === 'indigo',
      'ring-violet-300': tailwindColor === 'violet',
      'ring-purple-300': tailwindColor === 'purple',
      'ring-fuchsia-300': tailwindColor === 'fuchsia',
      'ring-pink-300': tailwindColor === 'pink',
      'ring-rose-300': tailwindColor === 'rose',
    })
  }

  return (
    <Menu as="div" className={clsx('flex rounded-md', className, label && 'justify-between')}>
      {label && <Label>{label}</Label>}
      <Menu.Button
        as="button"
        ref={setReferenceElement}
        className={clsx('rounded-full', {
          'w-6 h-6': size === 'sm',
          'w-8 h-8': size === 'md',
          'w-10 h-10': size === 'lg',
        })}
        style={{ backgroundColor: value || 'black' }}
      />

      <Portal>
        <Menu.Items
          as="div"
          ref={setPopperElement}
          role="listbox"
          className="bg-white border border-gray-200 z-40 p-4 flex items-center space-x-2 rounded-md shadow-lg focus:outline-none"
          style={styles.popper}
          {...attributes.popper}
        >
          {colors.map((color) => (
            <Menu.Item key={color}>
              {({ active }) => (
                <div
                  tabIndex={0}
                  className={clsx(
                    'inline-flex items-center justify-center w-5 h-5 rounded-full hover:ring-2 ring-offset-2 ring-opacity-50',
                    ringColorClasses(color),
                    { 'ring-1': active },
                  )}
                  style={{ backgroundColor: color }}
                  title={upperFirst(hexToTailwindColor(color))}
                  onClick={() => onChange(color)}
                >
                  {value === color && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Portal>
    </Menu>
  )
}
