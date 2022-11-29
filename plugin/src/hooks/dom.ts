import type { RefObject } from 'react'
import { useEffect } from 'react'

// Updates the height of a <textarea> when the value changes.
export const useAutosizeTextArea = (
  textAreaRef: RefObject<HTMLTextAreaElement | null> | HTMLTextAreaElement | null,
  value: string,
) => {
  useEffect(() => {
    if (!textAreaRef) return
    const textArea = 'current' in textAreaRef ? textAreaRef.current : textAreaRef
    if (!textArea) return

    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    textArea.style.height = '0px'
    const scrollHeight = textArea.scrollHeight

    // We then set the height directly, outside of the render loop
    // Trying to set this with state or a ref will product an incorrect value.
    const maxHeight = parseInt(textArea.style.maxHeight || '0', 10)
    const minHeight = parseInt(textArea.style.minHeight || '16', 10)
    textArea.style.height = `${Math.max(Math.min(scrollHeight, maxHeight), minHeight)}px`
  }, [textAreaRef, value])
}
