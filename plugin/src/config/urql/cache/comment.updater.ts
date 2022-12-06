import type { Cache, UpdateResolver, UpdatesConfig } from '@urql/exchange-graphcache'
import type {
  AnnotationFragment,
  CommentFragment,
  CommentWasAddedSubscription,
  CommentWasAddedSubscriptionVariables,
  CommentsQuery,
  CommentsQueryVariables,
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from '~/graphql'
import { AnnotationFragmentDoc, CommentFragmentDoc, CommentsDocument } from '~/graphql'

const addCommentToCache = (cache: Cache, comment: CommentFragment | null | undefined) => {
  if (!comment) return

  cache.writeFragment(CommentFragmentDoc, comment)
  cache.updateQuery<CommentsQuery, CommentsQueryVariables>(
    {
      query: CommentsDocument,
      variables: { annotationId: comment.annotationId },
    },
    (data) => {
      if (!data) return data
      return {
        ...data,
        comments: [...data.comments, comment],
      }
    },
  )

  const annotation = cache.readFragment<AnnotationFragment>(AnnotationFragmentDoc, {
    __typename: 'Annotation',
    id: comment.annotationId,
  })
  if (!annotation) return

  cache.writeFragment(AnnotationFragmentDoc, {
    ...annotation,
    commentsCount: annotation.commentsCount + 1,
  })
}

const createComment: UpdateResolver<CreateCommentMutation, CreateCommentMutationVariables> = (result, args, cache) => {
  addCommentToCache(cache, result?.createComment)
}

const commentWasAdded: UpdateResolver<CommentWasAddedSubscription, CommentWasAddedSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  addCommentToCache(cache, result?.commentWasAdded)
}

export const updates: Partial<UpdatesConfig> = {
  Mutation: {
    createComment,
  },
  Subscription: {
    commentWasAdded,
  },
}
