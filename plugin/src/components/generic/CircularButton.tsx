import type { ComponentProps, ElementType } from 'react'
import { createElement, forwardRef } from 'react'
import clsx from 'clsx'
import type { PolymorphicComponentProps, PolymorphicComponentWithRef, PolymorphicRef } from '~/react-types'

export type CircularButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type CircularButtonColor = 'primary' | 'secondary' | 'red' | 'green' | 'transparent'

export interface CircularButtonProps {
  size?: CircularButtonSize
  color?: CircularButtonColor
  disabled?: boolean
  icon: (props: ComponentProps<'svg'>) => JSX.Element
}

const classesPrimary = 'text-white bg-primary-500 hover:bg-primary-700'
const classesSecondary = 'text-primary-700 bg-primary-100 hover:bg-primary-200'
const classesRed = 'text-red-50 bg-red-500 hover:bg-red-700'
const classesGreen = 'text-green-50 bg-green-500 hover:bg-green-700'
const classesTransparent = 'text-zinc-500 bg-transparent hover:bg-zinc-100 hover:text-zinc-700'
const classesPrimaryDisabled = 'text-white bg-primary-300 cursor-not-allowed'
const classesSecondaryDisabled = 'text-primary-400 bg-blueGray-100 cursor-not-allowed'
const classesRedDisabled = 'text-red-50 bg-red-300 cursor-not-allowed'
const classesGreenDisabled = 'text-green-50 bg-green-100 cursor-not-allowed'
const classesTransparentDisabled = 'text-zinc-500 bg-transparent cursor-not-allowed'

const CircularButton: PolymorphicComponentWithRef<'button', CircularButtonProps> = forwardRef(function CircularButton<
  T extends ElementType = 'button',
>(
  {
    as,
    size = 'sm',
    color = 'primary',
    disabled = false,
    icon: Icon,
    className,
    ...props
  }: PolymorphicComponentProps<T, CircularButtonProps>,
  ref: PolymorphicRef<T>,
) {
  return createElement(
    as || 'button',
    {
      ...props,
      ref,
      disabled,
      className: clsx(
        'inline-flex items-center rounded-full border border-transparent focus:outline-none transition-colors duration-200 ease-in-out',
        {
          [classesPrimary]: color === 'primary' && !disabled,
          [classesPrimaryDisabled]: color === 'primary' && disabled,
          [classesSecondary]: color === 'secondary' && !disabled,
          [classesSecondaryDisabled]: color === 'secondary' && disabled,
          [classesRed]: color === 'red' && !disabled,
          [classesRedDisabled]: color === 'red' && disabled,
          [classesGreen]: color === 'green' && !disabled,
          [classesGreenDisabled]: color === 'green' && disabled,
          [classesTransparent]: color === 'transparent' && !disabled,
          [classesTransparentDisabled]: color === 'transparent' && disabled,
        },
        {
          'p-1': size === 'xs' || size === '2xs',
          'p-1.5': size === 'sm',
          'p-2': size === 'md' || size === 'lg',
          'p-3': size === 'xl',
        },
        className,
      ),
    },
    <Icon
      className={size === 'xs' || size === 'sm' || size === 'md' ? 'h-5 w-5' : size === '2xs' ? 'h-4 w-4' : 'h-6 w-6'}
      aria-hidden="true"
    />,
  )
})

export default CircularButton
