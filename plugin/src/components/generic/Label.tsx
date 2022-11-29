import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

export default forwardRef<HTMLLabelElement, ComponentProps<'label'>>(function Label(
  { className, children, ...props },
  ref,
) {
  return (
    <label {...props} ref={ref} className={clsx('block text-sm font-medium text-gray-700 mb-0', className)}>
      {children}
    </label>
  )
})
