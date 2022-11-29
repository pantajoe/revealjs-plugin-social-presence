import type { VirtualElement } from '@popperjs/core'
import { useMemo, useRef } from 'react'
import Tooltip from '../generic/Tooltip'
import QuoteIcon from '../icons/QuoteIcon'
import { useHighlighting } from '~/hooks/use-highlighting'
import { useEvent } from '~/hooks/react'

export interface AnnotationTooltipProps {
  onClick: (selection: Range) => void
}

export default function AnnotationTooltip(props: AnnotationTooltipProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { cursorPosition, highlighting, selection, resetSelection } = useHighlighting({ element: ref })
  const virtualElement: VirtualElement | null = useMemo(
    () =>
      cursorPosition
        ? {
            getBoundingClientRect: () => ({
              width: 0,
              height: 0,
              top: cursorPosition?.y || 0,
              right: cursorPosition?.x || 0,
              bottom: cursorPosition?.y || 0,
              left: cursorPosition?.x || 0,
              x: cursorPosition?.x || 0,
              y: cursorPosition?.y || 0,
              toJSON: () => ({}),
            }),
          }
        : null,
    [cursorPosition],
  )

  const onClick = useEvent(() => {
    resetSelection()
    props.onClick(selection!)
  })

  if (!highlighting || !selection || !virtualElement) return null

  return (
    <Tooltip target={virtualElement} position="bottom" theme="light" size="lg">
      <div ref={ref} className="w-full h-full flex items-center justify-center">
        <button
          type="button"
          className="inline-flex flex-col items-center justify-center p-1 border-0 focus:outline-none text-gray-700 hover:text-gray-900 duration-200 ease-in-out"
          onClick={onClick}
        >
          <QuoteIcon className="w-5 h-5" aria-hidden="true" />
          <span className="text-xs">Annotate</span>
        </button>
      </div>
    </Tooltip>
  )
}
