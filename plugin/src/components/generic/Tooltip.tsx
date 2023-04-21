import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Modifier } from 'react-popper'
import { usePopper } from 'react-popper'
import { Portal } from '@headlessui/react'
import type { VirtualElement } from '@popperjs/core'
import type { TailwindColor } from '~/utils'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'
type TooltipTheme = 'light' | 'dark'

export interface TooltipProps {
  target: string | VirtualElement
  theme?: TooltipTheme
  size?: 'sm' | 'md' | 'lg'
  color?: TailwindColor
  position?: TooltipPosition
  className?: string
  children: ReactNode
}

export default function Tooltip({
  position = 'top',
  theme = 'dark',
  size = 'md',
  color,
  target,
  className,
  children,
}: TooltipProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | VirtualElement | null>(() =>
    typeof target === 'string' || !target ? null : target,
  )

  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const arrowModifier: Modifier<'arrow'> = useMemo(
    () => ({
      name: 'arrow',
      options: {
        element: arrowElement,
      },
    }),
    [arrowElement],
  )

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const offsetModifier: Modifier<'offset'> = useMemo(
    () => ({
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    }),
    [],
  )

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'absolute',
    placement: position,
    modifiers: [offsetModifier, arrowModifier],
  })

  useLayoutEffect(() => {
    if (typeof target !== 'string') return
    setReferenceElement(document.getElementById(target.replace('#', '')))
  }, [target])

  const [open, setOpen] = useState(() => typeof target !== 'string' && !!target)

  useEffect(() => {
    if (!(referenceElement instanceof HTMLElement)) return

    const show = () => setOpen(true)
    const hide = () => setOpen(false)

    referenceElement.addEventListener('mouseenter', show)
    referenceElement.addEventListener('mouseleave', hide)

    return () => {
      referenceElement.removeEventListener('mouseenter', show)
      referenceElement.removeEventListener('mouseleave', hide)
    }
  }, [referenceElement])

  const tooltipClasses = useMemo(
    () =>
      clsx(
        className,
        open ? 'visible' : 'invisible',
        color
          ? {
              'bg-zinc-600 text-zinc-100': color === 'zinc',
              'bg-red-600 text-red-100': color === 'red',
              'bg-orange-600 text-orange-100': color === 'orange',
              'bg-amber-600 text-amber-100': color === 'amber',
              'bg-lime-600 text-lime-100': color === 'lime',
              'bg-emerald-600 text-emerald-100': color === 'emerald',
              'bg-teal-600 text-teal-100': color === 'teal',
              'bg-cyan-600 text-cyan-100': color === 'cyan',
              'bg-blue-600 text-blue-100': color === 'blue',
              'bg-indigo-600 text-indigo-100': color === 'indigo',
              'bg-violet-600 text-violet-100': color === 'violet',
              'bg-purple-600 text-purple-100': color === 'purple',
              'bg-fuchsia-600 text-fuchsia-100': color === 'fuchsia',
              'bg-pink-600 text-pink-100': color === 'pink',
              'bg-rose-600 text-rose-100': color === 'rose',
            }
          : theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-900 border border-solid border-gray-200',
        'inline-block z-90 font-medium rounded-md shadow-sm max-w-[12rem]',
        {
          'py-1 px-1.5 text-xs': size === 'sm',
          'py-2 px-3 text-sm': size === 'md',
          'py-2 px-3 text-base': size === 'lg',
        },
        '[&[data-popper-placement^="top"]>.tooltip-arrow]:-bottom-1',
        '[&[data-popper-placement^="top"]>.tooltip-arrow::before]:border-b',
        '[&[data-popper-placement^="top"]>.tooltip-arrow::before]:border-r',
        '[&[data-popper-placement^="bottom"]>.tooltip-arrow]:-top-1',
        '[&[data-popper-placement^="bottom"]>.tooltip-arrow::before]:border-t',
        '[&[data-popper-placement^="bottom"]>.tooltip-arrow::before]:border-l',
        '[&[data-popper-placement^="right"]>.tooltip-arrow]:-left-1',
        '[&[data-popper-placement^="right"]>.tooltip-arrow::before]:border-b',
        '[&[data-popper-placement^="right"]>.tooltip-arrow::before]:border-l',
        '[&[data-popper-placement^="left"]>.tooltip-arrow]:-right-1',
        '[&[data-popper-placement^="left"]>.tooltip-arrow::before]:border-t',
        '[&[data-popper-placement^="left"]>.tooltip-arrow::before]:border-r',
      ),
    [className, theme, open, color, size],
  )

  const tooltipArrowClasses = useMemo(
    () =>
      clsx(
        'tooltip-arrow',
        open ? 'before:visible' : 'before:invisible',
        'absolute invisible w-2 h-2 bg-inherit',
        'before:absolute before:w-2 before:h-2 before:bg-inherit before:content-[""] before:rotate-45',
        theme === 'light' && !color ? 'before:border-gray-200' : 'before:border-transparent',
        {
          'border-b border-r': position === 'top' && theme === 'light',
          'border-t border-l': position === 'bottom' && theme === 'light',
          'border-b border-l': position === 'right' && theme === 'light',
          'border-t border-r': position === 'left' && theme === 'light',
        },
      ),
    [theme, open, position, color],
  )

  return (
    <Portal>
      {open && (
        <div
          ref={setPopperElement}
          role="tooltip"
          className={tooltipClasses}
          style={styles.popper}
          {...attributes.popper}
        >
          {children}
          <div ref={setArrowElement} className={tooltipArrowClasses} style={styles.arrow} />
        </div>
      )}
    </Portal>
  )
}
