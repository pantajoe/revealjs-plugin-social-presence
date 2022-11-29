import type { UpdatesConfig } from '@urql/exchange-graphcache'
import { updates as ParticipantUpdates } from './participant.updater'
import { updates as MessageUpdates } from './message.updater'
import { updates as GroupMemberUpdates } from './group-member.updater'
import { updates as AnnotationUpdates } from './annotation.updater'
import { updates as CommentUpdates } from './comment.updater'

export const updateResolvers: UpdatesConfig = {
  Mutation: {
    ...ParticipantUpdates.Mutation,
    ...MessageUpdates.Mutation,
    ...GroupMemberUpdates.Mutation,
    ...AnnotationUpdates.Mutation,
    ...CommentUpdates.Mutation,
  },
  Subscription: {
    ...ParticipantUpdates.Subscription,
    ...MessageUpdates.Subscription,
    ...GroupMemberUpdates.Subscription,
    ...AnnotationUpdates.Subscription,
    ...CommentUpdates.Subscription,
  },
}
