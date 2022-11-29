import { useWindowSize } from '@react-hookz/web'
import { useEffect, useMemo, useState } from 'react'

export interface MousePosition {
  x: number
  y: number
}

export interface ScaledMousePosition {
  x: number
  y: number
  pageWidth: number
  pageHeight: number
}

export const useMouse = () => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [])
  const dimensions = useWindowSize()
  const scaledPosition: ScaledMousePosition = useMemo(
    () => ({
      x: position.x,
      y: position.y,
      pageWidth: dimensions.width,
      pageHeight: dimensions.height,
    }),
    [position, dimensions],
  )

  return scaledPosition
}
