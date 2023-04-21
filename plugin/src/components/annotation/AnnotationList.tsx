import { useMemo } from 'react'
import AnnotationTile from './AnnotationTile'
import type { SocialAnnotation } from '~/graphql'
import { useAnnotations } from '~/hooks/use-annotations'
import { useRevealState } from '~/hooks/use-reveal-state'

const useSlideAnnotations = () => {
  const { slideElement } = useRevealState()
  const [{ annotations }] = useAnnotations()
  const highlights = useMemo(
    () => Array.from(slideElement.getElementsByTagName('annotation-highlight')) as HTMLElement[],
    [slideElement],
  )
  const slideAnnotations = useMemo(() => {
    const slideAnnotationIds = highlights.map((highlight) => highlight.dataset.annotationId as string)
    return annotations.filter((annotation) => slideAnnotationIds.includes(annotation.id))
  }, [annotations, highlights])
  const otherAnnotations = useMemo(() => {
    const slideAnnotationIds = highlights.map((highlight) => highlight.dataset.annotationId as string)
    return annotations.filter((annotation) => !slideAnnotationIds.includes(annotation.id))
  }, [annotations, highlights])

  return { slideAnnotations, otherAnnotations }
}

export interface AnnotationListProps {
  onSelect?: (annotation: SocialAnnotation) => any
}

export default function AnnotationList({ onSelect }: AnnotationListProps) {
  const { slideAnnotations, otherAnnotations } = useSlideAnnotations()

  return (
    <div className="w-full">
      {slideAnnotations.length === 0 && otherAnnotations.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-8">No annotations yet</div>
      )}

      {slideAnnotations.length > 0 && (
        <>
          <div className="bg-white sticky top-0 z-60 font-semibold text-gray-700 mb-4 text-sm">On this slide</div>
          <div className="w-full divide-y divide-solid divide-gray-200">
            {slideAnnotations.map((annotation) => (
              <AnnotationTile key={annotation.id} annotation={annotation} onClick={onSelect} />
            ))}
          </div>
        </>
      )}

      {otherAnnotations.length > 0 && (
        <>
          {slideAnnotations.length > 0 && (
            <div className="bg-white sticky top-0 z-60 font-semibold text-gray-700 my-4 text-sm">More</div>
          )}
          <div className="w-full divide-y divide-solid divide-gray-200">
            {otherAnnotations.map((annotation) => (
              <AnnotationTile key={annotation.id} annotation={annotation} onClick={onSelect} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
