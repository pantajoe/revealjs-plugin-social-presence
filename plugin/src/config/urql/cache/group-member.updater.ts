import type { Cache, UpdateResolver, UpdatesConfig } from '@urql/exchange-graphcache'
import type {
  GroupMemberJoinedSubscription,
  GroupMemberJoinedSubscriptionVariables,
  GroupMemberLeftSubscription,
  GroupMemberLeftSubscriptionVariables,
  GroupMembersQuery,
  GroupMembersQueryVariables,
  LeaveGroupMutation,
  LeaveGroupMutationVariables,
  UserFragment,
} from '~/graphql'
import { GroupMembersDocument, UserFragmentDoc } from '~/graphql'

const addGroupMemberToCache = (cache: Cache, user: UserFragment | null | undefined, groupId: string) => {
  if (!user) return

  cache.writeFragment(UserFragmentDoc, user)
  cache.updateQuery<GroupMembersQuery, GroupMembersQueryVariables>(
    {
      query: GroupMembersDocument,
      variables: { id: groupId },
    },
    (data) => {
      if (!data) return data

      return {
        ...data,
        groupMembers: [user, ...data.groupMembers],
      }
    },
  )
}

const removeGroupMemberFromCache = (cache: Cache, id: string, groupId: string) => {
  cache.updateQuery<GroupMembersQuery, GroupMembersQueryVariables>(
    {
      query: GroupMembersDocument,
      variables: { id: groupId },
    },
    (data) => {
      if (!data) return data

      return {
        ...data,
        groupMembers: data.groupMembers.filter((u) => u.id !== id),
      }
    },
  )
}

const leaveGroup: UpdateResolver<LeaveGroupMutation, LeaveGroupMutationVariables> = (result, args, cache) => {
  cache.invalidate({ __typename: 'Group', id: result.leaveGroup.id })
}

const groupMemberJoined: UpdateResolver<GroupMemberJoinedSubscription, GroupMemberJoinedSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  addGroupMemberToCache(cache, result?.groupMemberJoined, args.id)
}

const groupMemberLeft: UpdateResolver<GroupMemberLeftSubscription, GroupMemberLeftSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  removeGroupMemberFromCache(cache, result.groupMemberLeft.id, args.id)
}

export const updates: Partial<UpdatesConfig> = {
  Mutation: {
    leaveGroup,
  },
  Subscription: {
    groupMemberJoined,
    groupMemberLeft,
  },
}
