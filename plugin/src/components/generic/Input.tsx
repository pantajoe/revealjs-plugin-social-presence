import type { ComponentProps } from 'react'
import { forwardRef, useMemo } from 'react'
import clsx from 'clsx'
import Label from './Label'

export interface InputProps extends ComponentProps<'input'> {
  label?: string
  hint?: string
  error?: string
  icon?: (props: ComponentProps<'svg'>) => JSX.Element
  iconPosition?: 'leading' | 'trailing'
  iconClassName?: string
  addon?: ((props: ComponentProps<'span'>) => JSX.Element) | string
  addonPosition?: 'leading' | 'trailing'
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    error,
    className,
    disabled = false,
    icon: Icon,
    iconClassName,
    iconPosition = 'leading',
    addon,
    addonPosition = 'leading',
    ...props
  },
  ref,
) {
  const hasIcon = useMemo(() => Boolean(Icon), [Icon])
  const hasAddon = useMemo(() => Boolean(addon), [addon])
  const inputWrapperCssClasses = useMemo(
    () =>
      clsx('flex', {
        'mt-1': label || hint,
        'relative rounded-sm': hasIcon,
      }),
    [label, hint, hasIcon],
  )

  const inputCssClasses = useMemo(
    () =>
      clsx(
        'form-input block w-full rounded-md py-2 placeholder-[#d1d2da] border text-sm focus:outline-0 focus:ring-0',
        {
          'px-3': !hasIcon,
          'pl-10': hasIcon && iconPosition === 'leading',
          'pr-10': hasIcon && iconPosition === 'trailing',
          'border-gray-200 hover:border-gray-300 focus:border-primary-500': !error,
          'text-red-900 placeholder-red-300 border-red-300 hover:border-red-400 focus:border-red-500': error,
          'bg-gray-100': disabled,
          'rounded-r-md rounded-l-none': hasAddon && addonPosition === 'leading',
          'rounded-l-md rounded-r-none': hasAddon && addonPosition === 'trailing',
        },
      ),
    [addonPosition, disabled, error, hasAddon, hasIcon, iconPosition],
  )

  const addonClasses = useMemo(
    () =>
      clsx('text-sm inline-flex items-center px-3 border border-gray-200 bg-gray-50 text-gray-500 whitespace-nowrap', {
        'rounded-l-md border-r-0': addonPosition === 'leading',
        'rounded-r-md border-l-0': addonPosition === 'trailing',
      }),
    [addonPosition],
  )

  return (
    <div>
      {Boolean(label || hint) && (
        <div className={clsx('flex', label ? 'justify-between' : 'justify-end')}>
          {label && <Label htmlFor={id}>{label}</Label>}
          {Boolean(hint) && <span className="text-sm text-gray-500">{hint}</span>}
        </div>
      )}

      <div className={inputWrapperCssClasses}>
        {Icon && iconPosition === 'leading' ? (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={clsx('h-5 w-5', iconClassName, error ? 'text-red-500' : 'text-gray-400')}
              aria-hidden="true"
            />
          </div>
        ) : null}
        {addon && addonPosition === 'leading' ? (
          typeof addon === 'string' ? (
            <span className={addonClasses}>{addon}</span>
          ) : (
            addon({ className: addonClasses })
          )
        ) : null}

        <input id={id} disabled={disabled} className={clsx(inputCssClasses, className)} {...props} ref={ref} />

        {Icon && iconPosition === 'trailing' ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300'">
            <Icon
              className={clsx('h-5 w-5', iconClassName, error ? 'text-red-500' : 'text-gray-400')}
              aria-hidden="true"
            />
          </div>
        ) : null}
        {addon && addonPosition === 'trailing' ? (
          typeof addon === 'string' ? (
            <span className={addonClasses}>{addon}</span>
          ) : (
            addon({ className: addonClasses })
          )
        ) : null}
      </div>

      {Boolean(error) && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})

export default Input
