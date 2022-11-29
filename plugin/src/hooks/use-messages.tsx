import type { Emitter } from 'mitt'
import mitt from 'mitt'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react'
import type { CombinedError } from 'urql'
import type { MessageFragment as Message, MessagesQuery, MessagesQueryVariables } from '~/graphql'
import { MessagesDocument, useMessageWasSentSubscription, useMessagesQuery, useSendMessageMutation } from '~/graphql'
import { useEvent } from '~/hooks/react'
import { useClient } from '~/hooks/use-client'

export const MESSAGES_PER_PAGE = 20 as const

export interface UseMessagesOptions {
  pause?: boolean
  groupId?: string
  onMessageReceived?: (message: Message) => any
}

export const useMessages = ({ groupId, onMessageReceived, pause = false }: UseMessagesOptions = {}) => {
  const [{ fetching, data, error }] = useMessagesQuery({ variables: { first: MESSAGES_PER_PAGE, groupId }, pause })
  const messages = data?.messages.nodes ?? []
  const { client } = useClient()
  const fetchMoreMessages = async () => {
    const { endCursor, hasNextPage } = data?.messages.pageInfo || {}
    if (!hasNextPage) return
    await client
      .query<MessagesQuery, MessagesQueryVariables>(MessagesDocument, {
        first: MESSAGES_PER_PAGE,
        after: endCursor,
        groupId,
      })
      .toPromise()
  }

  useMessageWasSentSubscription({ variables: { groupId }, pause }, (prev, data) => {
    if (data?.messageWasSent) {
      onMessageReceived?.(data.messageWasSent)
    }
    return data
  })

  const [{ fetching: sending }, sendMessageMutation] = useSendMessageMutation()
  const sendMessage = useEvent(async (text: string, parentMessage?: Message | null | undefined) => {
    await sendMessageMutation({ text, parentMessage: parentMessage?.id, groupId })
  })

  return {
    messages,
    fetching,
    error,
    fetchMoreMessages,
    sendMessage,
    sending,
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ChatEvents = {
  'message-received': Message
}

export interface ChatContextState {
  messages: Message[]
  fetching: boolean
  error: CombinedError | undefined
  sending: boolean
  events: Emitter<ChatEvents>
}

export interface ChatContextActions {
  fetchMoreMessages: () => Promise<void>
  sendMessage: (text: string, parentMessage?: Message | null | undefined) => Promise<void>
}

export type ChatContextValue = [ChatContextState, ChatContextActions]

export const ChatContext = createContext<ChatContextValue | null>(null)

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [events] = useState(() => mitt<ChatEvents>())
  const { messages, fetching, error, fetchMoreMessages, sendMessage, sending } = useMessages({
    onMessageReceived: (message) => {
      events.emit('message-received', message)
    },
  })

  return (
    <ChatContext.Provider
      value={[
        { messages, fetching, error, sending, events },
        { fetchMoreMessages, sendMessage },
      ]}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
