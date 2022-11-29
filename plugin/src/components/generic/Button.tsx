import type { ComponentProps, ElementType } from 'react'
import { createElement, forwardRef } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'
import type {
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicComponentWithRef,
  PolymorphicRef,
} from '~/react-types'

export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ButtonType = 'button' | 'a'

export type ButtonColor = 'primary' | 'secondary' | 'white' | 'transparent' | 'red'

export interface ButtonBaseProps {
  size?: ButtonSize
  color?: ButtonColor
  loading?: boolean
  disabled?: boolean
  icon?: (props: ComponentProps<'svg'>) => JSX.Element
  iconPosition?: 'leading' | 'trailing'
}

export type ButtonProps<T extends ElementType> = PolymorphicComponentPropsWithRef<T, ButtonBaseProps>

const classesPrimary = 'border-transparent text-white bg-primary-600 hover:bg-primary-700'
const classesSecondary = 'border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200'
const classesWhite = 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
const classesTransparent = 'border-transparent text-zinc-500 bg-transparent hover:bg-primary-100 hover:text-zinc-700'
const classesTransparentDisabled = 'border-transparent text-zinc-500 bg-transparent'
const classesRed = 'border-transparent text-white bg-red-600 hover:bg-red-700'
const classesPrimaryDisabled = 'border-transparent text-white bg-primary-300 cursor-not-allowed'
const classesSecondaryDisabled = 'border-transparent text-primary-400 bg-blueGray-100 cursor-not-allowed'
const classesWhiteDisabled = 'border-gray-300 text-gray-500 bg-gray-50'
const classesRedDisabled = 'border-transparent text-white bg-red-300 cursor-not-allowed'

const Button: PolymorphicComponentWithRef<'button', ButtonBaseProps> = forwardRef(function Button<
  T extends ElementType = 'button',
>(
  {
    as,
    size = 'sm',
    color = 'primary',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'leading',
    className,
    children,
    ...props
  }: PolymorphicComponentProps<T, ButtonBaseProps>,
  ref: PolymorphicRef<T>,
) {
  const hasText = Boolean(children)

  const leadingIconCssClasses = clsx(
    {
      'h-4 w-4': size === 'xxs' || size === 'xs' || size === 'sm',
      'h-5 w-5': size === 'md' || size === 'lg' || size === 'xl',
    },
    {
      '-ml-[1px] mr-1.5': (size === 'xs' || size === 'xxs') && hasText,
      '-ml-0.5 mr-2': size === 'sm' && hasText,
      '-ml-1 mr-2': size === 'md' && hasText,
      '-ml-1 mr-3': (size === 'lg' || size === 'xl') && hasText,
    },
  )

  const trailingIconCssClasses = clsx(size === 'xs' || size === 'sm' ? 'h-4 w-4' : 'h-5 w-5', {
    'ml-1.5 -mr-[1px]': (size === 'xs' || size === 'xxs') && hasText,
    'ml-2 -mr-0.5': size === 'sm' && hasText,
    'ml-2 -mr-1': size === 'md' && hasText,
    'ml-3 -mr-1': (size === 'lg' || size === 'xl') && hasText,
  })

  return createElement(
    as || 'button',
    {
      ...props,
      ref,
      disabled: disabled || loading,
      className: clsx(
        'inline-flex items-center justify-center border font-medium focus:outline-none transition-colors duration-200 ease-in-out rounded-md',
        {
          [classesPrimary]: color === 'primary' && !(disabled || loading),
          [classesPrimaryDisabled]: color === 'primary' && (disabled || loading),
          [classesSecondary]: color === 'secondary' && !(disabled || loading),
          [classesSecondaryDisabled]: color === 'secondary' && (disabled || loading),
          [classesWhite]: color === 'white' && !(disabled || loading),
          [classesWhiteDisabled]: color === 'white' && (disabled || loading),
          [classesTransparent]: color === 'transparent' && !(disabled || loading),
          [classesTransparentDisabled]: color === 'transparent' && (disabled || loading),
          [classesRed]: color === 'red' && !(disabled || loading),
          [classesRedDisabled]: color === 'red' && (disabled || loading),
        },
        {
          'px-2.5 py-1.5 leading-none text-[13px] rounded': size === 'xxs',
          'px-2.5 py-1.5 text-sm': size === 'xs',
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-4 py-2 text-base': size === 'lg',
          'px-6 py-3 text-base': size === 'xl',
        },
        className,
      ),
    },
    loading ? (
      <Spinner className={leadingIconCssClasses} aria-hidden="true" />
    ) : (
      iconPosition === 'leading' && Icon && <Icon className={leadingIconCssClasses} aria-hidden="true" />
    ),
    children,
    iconPosition === 'trailing' && !loading && Icon && <Icon className={trailingIconCssClasses} aria-hidden="true" />,
  )
})

export default Button
