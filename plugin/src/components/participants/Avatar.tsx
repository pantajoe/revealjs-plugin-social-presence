import clsx from 'clsx'
import { forwardRef } from 'react'
import type { ComponentProps } from 'react'

export interface AvatarProps extends ComponentProps<'span'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  name: string
  src?: string
  color: string
  status?: 'online' | 'offline' | false
}

export default forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'md', src, name, color, status = false, className, style, ...props },
  ref,
) {
  const sizeClass = clsx({
    'w-6 h-6': size === 'xs',
    'w-8 h-8': size === 'sm',
    'w-10 h-10': size === 'md',
    'w-12 h-12': size === 'lg',
    'w-14 h-14': size === 'xl',
    'w-16 h-16': size === '2xl',
  })

  return (
    <span
      ref={ref}
      className={clsx(className, 'relative inline-block border-2 border-solid rounded-full')}
      style={{ borderColor: color, ...style }}
      {...props}
    >
      {src ? (
        <img className={clsx('rounded-full', sizeClass)} src={src} alt={name} />
      ) : (
        <span className={clsx('inline-flex items-center justify-center rounded-full bg-gray-500', sizeClass)}>
          <span className="font-medium leading-none text-white">{name[0].toUpperCase()}</span>
        </span>
      )}
      {status !== false && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            status === 'online' ? 'bg-green-400' : 'bg-gray-300',
            {
              'w-1.5 h-1.5': size === 'xs',
              'w-2 h-2': size === 'sm',
              'w-2.5 h-2.5': size === 'md',
              'w-3 h-3': size === 'lg',
              'w-3.5 h-3.5': size === 'xl',
              'w-4 h-4': size === '2xl',
            },
          )}
        />
      )}
    </span>
  )
})
