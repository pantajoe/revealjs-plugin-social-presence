import { CursorArrowRaysIcon } from '@heroicons/react/20/solid'
import type { WindowSize } from '@react-hookz/web'
import { useWindowSize } from '@react-hookz/web'
import { useMemo } from 'react'
import { useControls } from '~/hooks/use-controls'
import { useGroup } from '~/hooks/use-group'
import type { ScaledMousePosition } from '~/hooks/use-mouse'
import { usePresence } from '~/hooks/use-presence'
import { slidesMatch, useRevealState } from '~/hooks/use-reveal-state'

const cursorPositionToTransform = (mouse: ScaledMousePosition, windowDimensions: WindowSize, addition = 0) => {
  const { x, y, pageWidth, pageHeight } = mouse
  const { width, height } = windowDimensions
  const xScale = width / pageWidth
  const yScale = height / pageHeight
  const scaledX = x * xScale
  const scaledY = y * yScale
  return `translate(${scaledX + addition}px, ${scaledY + addition}px)`
}

export default function CursorCanvas() {
  const [{ showOnlyGroupCursors }] = useControls()
  const [{ group, members }] = useGroup()
  const [{ mousePositions }] = usePresence()
  const { slide } = useRevealState()
  const currentCursors = useMemo(() => {
    const cursorsOnSlide = mousePositions.filter((mousePosition) => slidesMatch(mousePosition.slide, slide))
    if (showOnlyGroupCursors && group?.id) {
      return cursorsOnSlide.filter(({ user }) => members.some((member) => member.id === user.id))
    }
    return cursorsOnSlide
  }, [mousePositions, slide, group?.id, members, showOnlyGroupCursors])
  const dimensions = useWindowSize()

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        {currentCursors.map(({ user, mouse }) => (
          <>
            <CursorArrowRaysIcon
              key={user.id}
              className="absolute w-5 h-5 transition-transform"
              style={{
                transform: cursorPositionToTransform(mouse, dimensions),
                color: user.profileColor,
              }}
            />
            <span
              className="absolute transition-transform text-white text-2xs p-0.5 rounded-sm"
              style={{
                transform: cursorPositionToTransform(mouse, dimensions, 20),
                backgroundColor: user.profileColor,
              }}
            >
              {user.name}
            </span>
          </>
        ))}
      </div>
    </div>
  )
}
