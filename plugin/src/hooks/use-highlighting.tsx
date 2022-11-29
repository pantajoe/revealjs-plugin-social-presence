import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function selectedRange(): Range | null {
  const selection = document.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return null
  }
  const range = selection.getRangeAt(0)
  if (range.collapsed) {
    return null
  }
  // Don't highlight if the selection is inside the app. Only allow content to be highlighted
  if (selection.anchorNode && document.getElementById('social-presence')!.contains(selection.anchorNode)) {
    return null
  }
  return range
}

export interface UseHighlightingOptions {
  /**
   * The element to consume a highlighted selection on.
   * Necessary to prevent the selection from being lost when the user clicks outside of the element.
   */
  element: RefObject<HTMLElement | null>
}

export const useHighlighting = ({ element }: UseHighlightingOptions) => {
  const [range, setRange] = useState<Range | null>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const cursorPosition: typeof cursor = useMemo(() => {
    if (!cursor || !range) return null
    const rect = range.getBoundingClientRect()
    return {
      x: rect.x + rect.width - 8,
      y: rect.y + rect.height,
    }
  }, [cursor, range])

  const highlighting = useMemo(() => Boolean(cursorPosition && range), [range, cursorPosition])

  useEffect(() => {
    const onSelectionChange = () => {
      const range = selectedRange()
      setRange(range)
    }

    const onMouseUp = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }

    const onMouseDown = (event: MouseEvent) => {
      if (event.target && element.current?.contains(event.target as Node)) return
      setCursor(null)
    }

    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousedown', onMouseDown)

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [element])

  const resetSelection = useCallback(() => {
    setRange(null)
    setCursor(null)
    document.getSelection()?.removeAllRanges()
  }, [])

  return {
    highlighting,
    cursorPosition,
    selection: range,
    resetSelection,
  }
}
