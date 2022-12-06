import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import AnnotationComments from '~/components/annotation/AnnotationComments'
import AnnotationList from '~/components/annotation/AnnotationList'
import type { SocialAnnotation } from '~/graphql'
import { useAnnotations } from '~/hooks/use-annotations'

export default function AnnotationView() {
  const [{ events }] = useAnnotations()
  const [selectedAnnotation, setSelectedAnnotation] = useState<SocialAnnotation | null>(null)
  useEffect(() => {
    events.on('highlight:click', setSelectedAnnotation)

    return () => {
      events.off('highlight:click', setSelectedAnnotation)
    }
  }, [events])

  if (!selectedAnnotation) return <AnnotationList onSelect={setSelectedAnnotation} />

  return (
    <div className="w-full">
      <div className="w-full mb-1">
        <button
          type="button"
          className="text-gray-500 text-sm hover:text-gray-700 inline-flex items-center"
          onClick={() => setSelectedAnnotation(null)}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" aria-hidden="true" />
          <span>Back</span>
        </button>
      </div>
      <AnnotationComments annotation={selectedAnnotation} onRemove={setSelectedAnnotation} />
    </div>
  )
}
