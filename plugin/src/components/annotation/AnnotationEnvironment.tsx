import { startTransition, useState } from 'react'
import AnnotationTooltip from './AnnotationTooltip'
import CreateAnnotationModal from './CreateAnnotationModal'
import { useEvent } from '~/hooks/react'

export default function AnnotationEnvironment() {
  const [showCreateAnnotationModal, setShowCreateAnnotationModal] = useState(false)
  const [range, setRange] = useState<Range | null>(null)
  const onAnnotation = useEvent((selection: Range) => {
    setRange(selection)
    startTransition(() => {
      setShowCreateAnnotationModal(true)
    })
  })

  return (
    <>
      <AnnotationTooltip onClick={onAnnotation} />
      <CreateAnnotationModal range={range} open={showCreateAnnotationModal} onClose={setShowCreateAnnotationModal} />
    </>
  )
}
