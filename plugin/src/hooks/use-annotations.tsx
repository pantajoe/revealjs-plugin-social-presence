import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Emitter } from 'mitt'
import mitt from 'mitt'
import { useLecture } from './use-lecture'
import { useControls } from './use-controls'
import { usePluginConfig } from './use-plugin-config'
import type { AnnotationCreateInput, CommentFragment, SocialAnnotation } from '~/graphql'
import {
  useAnnotationWasCreatedSubscription,
  useAnnotationWasRemovedSubscription,
  useAnnotationsQuery,
  useCommentWasAddedSubscription,
  useCreateAnnotationMutation,
  useDeleteAnnotationMutation,
} from '~/graphql'
import type { Selector } from '~/lib/annotation/annotation-types'
import type { AnnotationData } from '~/lib/annotation'
import { anchor, detachAll } from '~/lib/annotation'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Events = {
  'annotation:created': SocialAnnotation
  'comment:created': CommentFragment
  'highlight:click': SocialAnnotation
}

const useAnnotationAnchors = (annotations: SocialAnnotation[]) => {
  const [{ zenMode, showAnnotationHighlights }] = useControls()
  const config = usePluginConfig()
  const active = config.annotations
  const annotationData: AnnotationData[] = useMemo(
    () => annotations.map(({ target, id }): AnnotationData => ({ selectors: target, tag: id })),
    [annotations],
  )

  useEffect(() => {
    if (!active) return
    const anchors = anchor(annotationData)

    return () => {
      anchors.then(detachAll)
    }
  }, [annotationData, active])

  useEffect(() => {
    if (!zenMode && showAnnotationHighlights) {
      window.document.body.classList.remove('no-annotations')
    } else {
      window.document.body.classList.add('no-annotations')
    }
  }, [zenMode, showAnnotationHighlights])
}

export interface AnnotationsContextState {
  annotations: SocialAnnotation[]
  events: Emitter<Events>
}

export interface AnnotationsContextActions {
  addAnnotation: (annotation: Omit<AnnotationCreateInput, 'target'> & { target: Selector[] }) => Promise<void>
  removeAnnotation: (id: string) => Promise<void>
}

export type AnnotationsContextValue = [AnnotationsContextState, AnnotationsContextActions]

const AnnotationsContext = createContext<AnnotationsContextValue | null>(null)

export function AnnotationsProvider({ children }: PropsWithChildren) {
  const [{ lecture }] = useLecture()
  const [events] = useState(() => mitt<Events>())

  const [annotations, setAnnotations] = useState<SocialAnnotation[]>([])
  const [annotationsQuery] = useAnnotationsQuery({ pause: !lecture })
  useEffect(() => {
    setAnnotations(lecture ? annotationsQuery.data?.annotations ?? [] : [])
  }, [annotationsQuery, lecture])
  useAnnotationWasCreatedSubscription({ pause: !lecture }, (prev, data) => {
    if (!data) return data
    events.emit('annotation:created', data.annotationWasCreated as SocialAnnotation)
    return data
  })
  useCommentWasAddedSubscription({ pause: !lecture }, (prev, data) => {
    if (!data) return data
    events.emit('comment:created', data.commentWasAdded)
    return data
  })
  useAnnotationWasRemovedSubscription({ pause: !lecture })

  useAnnotationAnchors(annotations)

  const [, createAnnotationMutation] = useCreateAnnotationMutation()
  const addAnnotation: AnnotationsContextActions['addAnnotation'] = useCallback(
    async ({ quote, target, text }) => {
      await createAnnotationMutation({ quote, target, text })
    },
    [createAnnotationMutation],
  )

  const [, removeAnnotationMutation] = useDeleteAnnotationMutation()
  const removeAnnotation: AnnotationsContextActions['removeAnnotation'] = useCallback(
    async (id) => {
      await removeAnnotationMutation({ id })
    },
    [removeAnnotationMutation],
  )

  return (
    <AnnotationsContext.Provider
      value={[
        { annotations, events },
        { addAnnotation, removeAnnotation },
      ]}
    >
      {children}
    </AnnotationsContext.Provider>
  )
}

export const useAnnotations = () => {
  const context = useContext(AnnotationsContext)
  if (!context) {
    throw new Error('useAnnotations must be used within a AnnotationsProvider')
  }
  return context
}
