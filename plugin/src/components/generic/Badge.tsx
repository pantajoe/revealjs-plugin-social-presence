import type { HTMLAttributes, ReactNode } from 'react'
import { useMemo } from 'react'
import clsx from 'clsx'
import type { TailwindColor } from '~/utils'

export const TailwindColorMap = {
  zinc: '#71717a',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  lime: '#84cc16',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
} as const

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TailwindColor | 'primary'
  size?: 'sm' | 'lg'
  dot?: boolean
  remove?: boolean
  onRemove?: () => void
  children: ReactNode
}

export default function Badge({
  color = 'primary',
  size = 'sm',
  dot = false,
  remove = false,
  onRemove,
  children,
  className,
  ...rest
}: BadgeProps) {
  const colorClasses = useMemo(
    () => ({
      'bg-primary-100 text-primary-800': color === 'primary',
      'bg-zinc-100 text-zinc-800': color === 'zinc',
      'bg-red-100 text-red-800': color === 'red',
      'bg-orange-100 text-orange-800': color === 'orange',
      'bg-amber-100 text-amber-800': color === 'amber',
      'bg-lime-100 text-lime-800': color === 'lime',
      'bg-emerald-100 text-emerald-800': color === 'emerald',
      'bg-teal-100 text-teal-800': color === 'teal',
      'bg-cyan-100 text-cyan-800': color === 'cyan',
      'bg-blue-100 text-blue-800': color === 'blue',
      'bg-indigo-100 text-indigo-800': color === 'indigo',
      'bg-violet-100 text-violet-800': color === 'violet',
      'bg-purple-100 text-purple-800': color === 'purple',
      'bg-fuchsia-100 text-fuchsia-800': color === 'fuchsia',
      'bg-pink-100 text-pink-800': color === 'pink',
      'bg-rose-100 text-rose-800': color === 'rose',
    }),
    [color],
  )

  const dotColorClasses = useMemo(
    () => ({
      'text-primary-400': color === 'primary',
      'text-zinc-400': color === 'zinc',
      'text-red-400': color === 'red',
      'text-orange-400': color === 'orange',
      'text-amber-400': color === 'amber',
      'text-lime-400': color === 'lime',
      'text-emerald-400': color === 'emerald',
      'text-teal-400': color === 'teal',
      'text-cyan-400': color === 'cyan',
      'text-blue-400': color === 'blue',
      'text-indigo-400': color === 'indigo',
      'text-violet-400': color === 'violet',
      'text-purple-400': color === 'purple',
      'text-fuchsia-400': color === 'fuchsia',
      'text-pink-400': color === 'pink',
      'text-rose-400': color === 'rose',
    }),
    [color],
  )

  const removeColorClasses = useMemo(
    () => ({
      'text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500': color === 'primary',
      'text-zinc-400 hover:bg-zinc-200 hover:text-zinc-500 focus:bg-zinc-500': color === 'zinc',
      'text-red-400 hover:bg-red-200 hover:text-red-500 focus:bg-red-500': color === 'red',
      'text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:bg-orange-500': color === 'orange',
      'text-amber-400 hover:bg-amber-200 hover:text-amber-500 focus:bg-amber-500': color === 'amber',
      'text-lime-400 hover:bg-lime-200 hover:text-lime-500 focus:bg-lime-500': color === 'lime',
      'text-emerald-400 hover:bg-emerald-200 hover:text-emerald-500 focus:bg-emerald-500': color === 'emerald',
      'text-teal-400 hover:bg-teal-200 hover:text-teal-500 focus:bg-teal-500': color === 'teal',
      'text-cyan-400 hover:bg-cyan-200 hover:text-cyan-500 focus:bg-cyan-500': color === 'cyan',
      'text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500': color === 'blue',
      'text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500': color === 'indigo',
      'text-violet-400 hover:bg-violet-200 hover:text-violet-500 focus:bg-violet-500': color === 'violet',
      'text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:bg-purple-500': color === 'purple',
      'text-fuchsia-400 hover:bg-fuchsia-200 hover:text-fuchsia-500 focus:bg-fuchsia-500': color === 'fuchsia',
      'text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:bg-pink-500': color === 'pink',
      'text-rose-400 hover:bg-rose-200 hover:text-rose-500 focus:bg-rose-500': color === 'rose',
    }),
    [color],
  )

  return (
    <span
      className={clsx(
        'inline-flex items-center py-0.5 rounded font-medium whitespace-nowrap cursor-default',
        size === 'sm' ? 'pl-2 text-xs' : 'pl-2.5 text-sm',
        size === 'sm' ? (remove ? 'pr-0.5' : 'pr-2') : remove ? 'pr-1' : 'pr-2.5',
        colorClasses,
        className,
      )}
      {...rest}
    >
      {dot && (
        <svg
          className={clsx('mr-1.5 h-2 w-2', size === 'lg' ? '-ml-0.5' : '', dotColorClasses)}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx={4} cy={4} r={3} />
        </svg>
      )}
      {children}
      {remove && (
        <button
          type="button"
          className={clsx(
            'flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center focus:text-white focus:outline-none',
            removeColorClasses,
          )}
          onClick={onRemove}
        >
          <span className="sr-only">Remove</span>
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  )
}
