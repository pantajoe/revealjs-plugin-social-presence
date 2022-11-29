import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'

export interface TabPillProps extends Omit<ComponentProps<'button'>, 'type'> {
  active?: boolean
}

export default forwardRef<HTMLButtonElement, TabPillProps>(function TabPill(
  { active = false, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      {...props}
      type="button"
      className={clsx(
        className,
        active
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        'py-4 px-1 text-center border-b-2 font-medium text-sm focus:outline-none',
      )}
    >
      {children}
    </button>
  )
})
