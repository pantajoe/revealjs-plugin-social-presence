import clsx from 'clsx'
import { Switch } from '@headlessui/react'
import Label from './Label'

export type ToggleSize = 'sm' | 'md'

export interface ToggleProps {
  label?: string
  description?: string
  name?: string
  value: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
  className?: string
  reverseAligned?: boolean
  size?: ToggleSize
}

export default function Toggle({
  label,
  description,
  name,
  value,
  onChange,
  disabled = false,
  className,
  reverseAligned,
  size = 'md',
}: ToggleProps) {
  return (
    <Switch.Group
      as="div"
      className={clsx('flex items-center justify-between', reverseAligned && 'flex-row-reverse', className)}
    >
      {label && (
        <span className={clsx('flex-grow flex flex-col', reverseAligned ? 'ml-3' : 'mr-3')}>
          <Switch.Label as={Label} className="!text-gray-900" passive>
            {label}
          </Switch.Label>
          {description && (
            <Switch.Description as="span" className="text-sm text-gray-500">
              {description}
            </Switch.Description>
          )}
        </span>
      )}
      <Switch
        as="button"
        type="button"
        name={name}
        checked={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          value ? 'bg-primary-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none',
          { 'h-5 w-9': size === 'sm', 'h-6 w-11': size === 'md' },
          { 'cursor-not-allowed': disabled },
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={clsx(
            value ? (size === 'sm' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0',
            'pointer-events-none inline-block  rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            { 'h-4 w-4': size === 'sm', 'h-5 w-5': size === 'md' },
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
