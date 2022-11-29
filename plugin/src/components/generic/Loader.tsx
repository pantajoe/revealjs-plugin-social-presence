import clsx from 'clsx'
import type { ComponentProps } from 'react'

export default function Loader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div {...props} className={clsx(className, 'spinner')}>
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  )
}
