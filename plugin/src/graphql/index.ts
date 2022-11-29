import type { AnnotationFragment } from './__generated__/operations'
import type { Selector } from '~/lib/annotation/annotation-types'

export type SocialAnnotation = Omit<AnnotationFragment, 'target'> & {
  target: Selector[]
}

export * from './__generated__/operations'
