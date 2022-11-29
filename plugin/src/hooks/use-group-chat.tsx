import type { Emitter } from 'mitt'
import mitt from 'mitt'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useState } from 'react'
import type { CombinedError } from 'urql'
import type { ChatEvents } from './use-messages'
import { useMessages } from './use-messages'
import { useGroup } from './use-group'
import type { MessageFragment as Message } from '~/graphql'

export interface GroupChatContextState {
  messages: Message[]
  fetching: boolean
  error: CombinedError | undefined
  sending: boolean
  events: Emitter<ChatEvents>
}

export interface GroupChatContextActions {
  fetchMoreMessages: () => Promise<void>
  sendMessage: (text: string, parentMessage?: Message | null | undefined) => Promise<void>
}

export type GroupChatContextValue = [GroupChatContextState, GroupChatContextActions]

export const GroupChatContext = createContext<GroupChatContextValue | null>(null)

export const GroupChatProvider = ({ children }: PropsWithChildren) => {
  const [{ group }] = useGroup()
  const [events] = useState(() => mitt<ChatEvents>())
  const { messages, fetching, error, fetchMoreMessages, sendMessage, sending } = useMessages({
    groupId: group?.id,
    pause: !group,
    onMessageReceived: (message) => {
      events.emit('message-received', message)
    },
  })

  return (
    <GroupChatContext.Provider
      value={[
        { messages, fetching, error, sending, events },
        { fetchMoreMessages, sendMessage },
      ]}
    >
      {children}
    </GroupChatContext.Provider>
  )
}

export const useGroupChat = () => {
  const context = useContext(GroupChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
