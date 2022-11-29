import type { Cache, UpdateResolver, UpdatesConfig } from '@urql/exchange-graphcache'
import type {
  DeleteProfileMutation,
  DeleteProfileMutationVariables,
  KickParticipantMutation,
  KickParticipantMutationVariables,
  ParticipantJoinedSubscription,
  ParticipantJoinedSubscriptionVariables,
  ParticipantLeftSubscription,
  ParticipantLeftSubscriptionVariables,
  ParticipantsQuery,
  ParticipantsQueryVariables,
  UserFragment,
  UserWasRemovedSubscription,
  UserWasRemovedSubscriptionVariables,
} from '~/graphql'
import { ParticipantsDocument, UserFragmentDoc } from '~/graphql'

const addParticipantToCache = (cache: Cache, user: UserFragment | null | undefined) => {
  if (!user) return

  cache.writeFragment(UserFragmentDoc, user)
  cache.updateQuery<ParticipantsQuery, ParticipantsQueryVariables>({ query: ParticipantsDocument }, (data) => {
    if (!data?.participants) return data
    if (data.participants.find((u) => u.id === user.id)) return data

    return {
      ...data,
      participants: [user, ...data.participants],
    }
  })
}

const removeParticipantFromCache = (cache: Cache, id: string) => {
  cache.invalidate({ __typename: 'User', id })
}

const kickParticipant: UpdateResolver<KickParticipantMutation, KickParticipantMutationVariables> = (
  result,
  args,
  cache,
) => {
  removeParticipantFromCache(cache, args.userId)
}

const deleteProfile: UpdateResolver<DeleteProfileMutation, DeleteProfileMutationVariables> = (result, args, cache) => {
  removeParticipantFromCache(cache, args.id)
}

const participantJoined: UpdateResolver<ParticipantJoinedSubscription, ParticipantJoinedSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  addParticipantToCache(cache, result?.participantJoined)
}

const participantLeft: UpdateResolver<ParticipantLeftSubscription, ParticipantLeftSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  removeParticipantFromCache(cache, result.participantLeft.id)
}

const userWasRemoved: UpdateResolver<UserWasRemovedSubscription, UserWasRemovedSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  removeParticipantFromCache(cache, result.userWasRemoved.id)
}

export const updates: Partial<UpdatesConfig> = {
  Mutation: {
    deleteProfile,
    kickParticipant,
  },
  Subscription: {
    participantJoined,
    participantLeft,
    userWasRemoved,
  },
}
