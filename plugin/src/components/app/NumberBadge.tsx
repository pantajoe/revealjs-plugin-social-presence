import clsx from 'clsx'
import type { ComponentProps } from 'react'

export default function NumberBadge({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'absolute right-0 bottom-0 rounded-full text-white bg-red-400 font-medium text-xs inline-flex items-center justify-center w-4 h-4',
      )}
    >
      {children}
    </span>
  )
}
