import type { Cache, UpdateResolver, UpdatesConfig } from '@urql/exchange-graphcache'
import type {
  MessageFragment,
  MessageWasSentSubscription,
  MessageWasSentSubscriptionVariables,
  MessagesQuery,
  MessagesQueryVariables,
  SendMessageMutation,
  SendMessageMutationVariables,
} from '~/graphql'
import { MessageFragmentDoc, MessagesDocument } from '~/graphql'
import { MESSAGES_PER_PAGE } from '~/hooks/use-messages'

const addMessageToCache = (cache: Cache, message: MessageFragment | null | undefined) => {
  if (!message) return

  cache.writeFragment(MessageFragmentDoc, message)
  cache.updateQuery<MessagesQuery, MessagesQueryVariables>(
    { query: MessagesDocument, variables: { first: MESSAGES_PER_PAGE, after: null, groupId: message.groupId } },
    (data) => {
      data?.messages?.nodes?.unshift(message)
      return data
    },
  )
}

const sendMessage: UpdateResolver<SendMessageMutation, SendMessageMutationVariables> = (result, args, cache) => {
  addMessageToCache(cache, result?.sendMessage)
}

const messageWasSent: UpdateResolver<MessageWasSentSubscription, MessageWasSentSubscriptionVariables> = (
  result,
  args,
  cache,
) => {
  addMessageToCache(cache, result?.messageWasSent)
}

export const updates: Partial<UpdatesConfig> = {
  Mutation: {
    sendMessage,
  },
  Subscription: {
    messageWasSent,
  },
}
