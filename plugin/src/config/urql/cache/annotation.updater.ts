import type { Cache, UpdateResolver, UpdatesConfig } from '@urql/exchange-graphcache'
import type {
  AnnotationFragment,
  AnnotationWasCreatedSubscription,
  AnnotationWasCreatedSubscriptionVariables,
  AnnotationWasRemovedSubscription,
  AnnotationWasRemovedSubscriptionVariables,
  AnnotationsQuery,
  AnnotationsQueryVariables,
  CreateAnnotationMutation,
  CreateAnnotationMutationVariables,
  DeleteAnnotationMutation,
  DeleteAnnotationMutationVariables,
} from '~/graphql'
import { AnnotationFragmentDoc, AnnotationsDocument } from '~/graphql'

const addAnnotationToCache = (cache: Cache, annotation: AnnotationFragment | null | undefined) => {
  if (!annotation) return

  cache.writeFragment(AnnotationFragmentDoc, annotation)
  cache.updateQuery<AnnotationsQuery, AnnotationsQueryVariables>(
    {
      query: AnnotationsDocument,
    },
    (data) => {
      if (!data) return data
      return {
        ...data,
        annotations: [...data.annotations, annotation],
      }
    },
  )
}

const createAnnotation: UpdateResolver<CreateAnnotationMutation, CreateAnnotationMutationVariables> = (
  result,
  args,
  cache,
) => {
  addAnnotationToCache(cache, result?.createAnnotation)
}

const deleteAnnotation: UpdateResolver<DeleteAnnotationMutation, DeleteAnnotationMutationVariables> = (
  result,
  args,
  cache,
) => {
  if (!result?.deleteAnnotation.success) return
  cache.invalidate({ __typename: 'Annotation', id: args.id })
}

const annotationWasCreated: UpdateResolver<
  AnnotationWasCreatedSubscription,
  AnnotationWasCreatedSubscriptionVariables
> = (result, args, cache) => {
  addAnnotationToCache(cache, result?.annotationWasCreated)
}

const annotationWasRemoved: UpdateResolver<
  AnnotationWasRemovedSubscription,
  AnnotationWasRemovedSubscriptionVariables
> = (result, args, cache) => {
  cache.invalidate({ __typename: 'Annotation', id: result?.annotationWasRemoved?.id })
}

export const updates: Partial<UpdatesConfig> = {
  Mutation: {
    createAnnotation,
    deleteAnnotation,
  },
  Subscription: {
    annotationWasCreated,
    annotationWasRemoved,
  },
}
