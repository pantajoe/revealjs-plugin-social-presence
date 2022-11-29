import { useEffect, useState } from 'react'

export interface SlideLocation {
  horizontalIndex: number
  verticalIndex: number
  fragmentIndex?: number
}

export const useRevealState = () => {
  const [slide, setSlide] = useState<SlideLocation>({
    horizontalIndex: 0,
    verticalIndex: 0,
  })
  const [slideElement, setSlideElement] = useState<HTMLElement>(() => Reveal.getCurrentSlide() as HTMLElement)

  useEffect(() => {
    const { h: horizontalIndex, v: verticalIndex, f: fragmentIndex } = Reveal.getIndices()
    setSlide({ horizontalIndex, verticalIndex, fragmentIndex })
  }, [])

  useEffect(() => {
    const onSlideChange = () => {
      const { h: horizontalIndex, v: verticalIndex, f: fragmentIndex } = Reveal.getIndices()
      setSlide({ horizontalIndex, verticalIndex, fragmentIndex })
      setSlideElement(Reveal.getCurrentSlide() as HTMLElement)
    }

    Reveal.addEventListener('slidechanged', onSlideChange)
    Reveal.addEventListener('fragmentshown', onSlideChange)
    Reveal.addEventListener('fragmenthidden', onSlideChange)

    return () => {
      Reveal.removeEventListener('slidechanged', onSlideChange)
      Reveal.removeEventListener('fragmentshown', onSlideChange)
      Reveal.removeEventListener('fragmenthidden', onSlideChange)
    }
  }, [])

  return { slide, slideElement }
}

export const slidesMatch = (a: SlideLocation, b: SlideLocation) => {
  return (
    a.horizontalIndex === b.horizontalIndex &&
    (a.verticalIndex === b.verticalIndex ||
      ([0, undefined].includes(a.verticalIndex) && [0, undefined].includes(b.verticalIndex)))
  )
}
