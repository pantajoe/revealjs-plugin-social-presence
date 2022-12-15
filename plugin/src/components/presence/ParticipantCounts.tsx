import { useEffect, useMemo, useState } from 'react'
import { usePresence } from '~/hooks/use-presence'

const createSlidePresenceElement = (presence: number) => {
  const element = document.createElement('span')
  element.className =
    'slide-presence-element hidden absolute left-4 bottom-4 rounded-full text-white bg-red-400 font-semibold inline-flex items-center justify-center text-7xl w-40 h-40'
  element.textContent = `+${presence}`
  return element
}

export default function ParticipantCounts() {
  const [{ getSlidePresence }] = usePresence()
  const [ready, setReady] = useState(() => Reveal.isReady())
  useEffect(() => {
    const onReady = () => setReady(true)
    Reveal.addEventListener('ready', onReady)
    return () => Reveal.removeEventListener('ready', onReady)
  })
  const slideElements = useMemo(() => (ready ? Reveal.getSlides() : []), [ready])

  useEffect(() => {
    if (!ready) return

    slideElements.forEach((slide) => {
      const indices = Reveal.getIndices(slide)
      const presence = getSlidePresence({ horizontalIndex: indices.h, verticalIndex: indices.v })
      if (presence > 0) {
        slide.appendChild(createSlidePresenceElement(presence))
      }
    })

    return () => {
      document.querySelectorAll('.slide-presence-element').forEach((element) => element.remove())
    }
  }, [getSlidePresence, slideElements, ready])

  return null
}
