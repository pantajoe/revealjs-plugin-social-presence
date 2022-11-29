import { useSyncedRef } from '@react-hookz/web'
import { useCallback, useEffect, useMemo } from 'react'
import { useAnnotations } from './use-annotations'
import { useControls } from './use-controls'
import type { SocialAnnotation } from '~/graphql'
import { useCommentWasAddedSubscription, useCommentsQuery, useCreateCommentMutation } from '~/graphql'

export const useAnnotation = (annotation: SocialAnnotation) => {
  const [commentsQuery] = useCommentsQuery({ variables: { annotationId: annotation.id } })
  useCommentWasAddedSubscription({ variables: { annotationId: annotation.id } })
  const comments = useMemo(() => commentsQuery.data?.comments ?? [], [commentsQuery.data?.comments])

  const [, addCommentMutation] = useCreateCommentMutation()
  const addComment = useCallback(
    async (text: string) => {
      await addCommentMutation({ annotationId: annotation.id, text })
    },
    [annotation.id, addCommentMutation],
  )

  return { comments, addComment }
}

export const useAnnotationHighlightClick = (enabled?: boolean) => {
  const [, { switchView }] = useControls()
  const [annotationsContext] = useAnnotations()
  const annotations = useSyncedRef(annotationsContext.annotations)

  useEffect(() => {
    if (!enabled) return

    const handler = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return
      const highlight = e.target.closest('annotation-highlight') as HTMLElement | null
      if (!highlight) return
      const annotation = annotations.current.find((a) => a.id === highlight.dataset.annotationId)
      if (!annotation) return

      switchView('annotation', false)
      setTimeout(() => {
        annotationsContext.events.emit('highlight:click', annotation)
      }, 100)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, annotations, switchView])
}
