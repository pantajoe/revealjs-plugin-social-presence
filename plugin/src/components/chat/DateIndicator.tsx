import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { getDayDifference } from '~/utils'

export interface DateIndicatorProps extends Omit<ComponentProps<'div'>, 'children'> {
  date: Date
}

export default function DateIndicator({ date, className, ...props }: DateIndicatorProps) {
  const formattedDate = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  const dayDiff = getDayDifference(date, new Date())
  const dateString = dayDiff === 0 ? 'Today' : dayDiff === 1 ? 'Yesterday' : formattedDate

  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-2 bg-gray-100 max-w-[75%] mx-auto px-2.5 py-1 rounded-lg border border-gray-100 text-xs text-gray-700 text-center',
      )}
    >
      {dateString}
    </div>
  )
}
