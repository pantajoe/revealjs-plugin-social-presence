import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: string
  description?: string
  children?: ReactNode
  error?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, label, description, className, error, checked = false, disabled = false, ...props },
  ref,
) {
  return (
    <div className="relative flex items-center">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          {...props}
          ref={ref}
          className={clsx(
            'form-checkbox focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded',
            disabled ? 'bg-gray-100 text-primary-400' : 'text-primary-600',
            error && 'border-red-500 focus:ring-red-500',
            className,
          )}
        />
      </div>
      {Boolean(label || description || children) && (
        <div className="ml-3 text-sm">
          {Boolean(label || children) && (
            <label
              htmlFor={props.id}
              className={clsx('!mb-0 flex items-center font-medium ', error ? 'text-red-600' : 'text-gray-700')}
            >
              {children ?? label}
            </label>
          )}
          {Boolean(description) && <p className="text-gray-500">{description}</p>}
        </div>
      )}
    </div>
  )
})

export default Checkbox
