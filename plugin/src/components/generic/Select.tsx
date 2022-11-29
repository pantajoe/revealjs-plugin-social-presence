import type { ComponentProps } from 'react'
import { forwardRef, useMemo } from 'react'
import clsx from 'clsx'
import Label from './Label'

export interface SelectOption {
  value?: string | number | undefined
  label?: string
}

export interface SelectProps extends ComponentProps<'select'> {
  options: SelectOption[]
  label?: string
  hint?: string
  error?: string
}

export default forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, className, label, hint, disabled = false, error, options, ...props },
  ref,
) {
  const inputCssClasses = useMemo(
    () =>
      clsx('form-select block w-full rounded-md px-3 py-2 border text-sm focus:outline-0 focus:ring-0', {
        'border-gray-200 hover:border-gray-300 focus:border-primary-500': !error,
        'text-red-900 placeholder-red-300 border-red-200 hover:border-red-300 focus:border-red-500': error,
        'bg-gray-100': disabled,
      }),
    [disabled, error],
  )

  return (
    <div>
      {Boolean(label || hint) && (
        <div className={clsx('flex', label ? 'justify-between' : 'justify-end')}>
          {label && <Label htmlFor={id}>{label}</Label>}
          {Boolean(hint) && <span className="text-sm text-gray-500">{hint}</span>}
        </div>
      )}

      <div className={label || hint ? 'mt-1' : ''}>
        <select id={id} disabled={disabled} className={clsx(inputCssClasses, className)} {...props} ref={ref}>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {Boolean(error) && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
})
