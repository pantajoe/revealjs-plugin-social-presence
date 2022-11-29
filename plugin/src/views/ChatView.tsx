import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { useMeasure } from '@react-hookz/web'
import { Fragment, useEffect, useRef, useState } from 'react'
import ChatBubble from '~/components/chat/ChatBubble'
import DateIndicator from '~/components/chat/DateIndicator'
import MessageInput from '~/components/chat/MessageInput'
import CircularButton from '~/components/generic/CircularButton'
import Loader from '~/components/generic/Loader'
import type { MessageFragment as Message } from '~/graphql'
import { useEvent, usePreviousRef } from '~/hooks/react'
import { useChat } from '~/hooks/use-messages'
import { getDayDifference } from '~/utils'

export default function ChatView() {
  const [{ messages, events, error, fetching, sending }, { fetchMoreMessages, sendMessage }] = useChat()

  const container = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const onMessageReceived = () => {
      if (container.current && container.current.scrollTop >= -20) {
        container.current?.scrollTo({ top: 1, behavior: 'smooth' })
      }
    }
    events.on('message-received', onMessageReceived)

    return () => {
      events.off('message-received', onMessageReceived)
    }
  }, [events])

  const onScroll = useEvent(async () => {
    if (!container.current) return
    if (container.current.scrollTop > 100 + container.current.clientHeight - container.current.scrollHeight + 1) return
    await fetchMoreMessages()
  })

  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const onParentMessageClick = useEvent((id: string | null | undefined) => {
    if (!container.current || !id) return
    const el = container.current.querySelector(`#message-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
    setHighlightedMessageId(id)
    setTimeout(() => setHighlightedMessageId(null), 1000)
  })

  const [{ height: msgInputHeight } = { height: 20 }, chatInput] = useMeasure<HTMLTextAreaElement>()
  const previousHeight = usePreviousRef(msgInputHeight)
  useEffect(() => {
    if (!container.current) return
    const prevHeight = previousHeight.current ?? 0
    if (prevHeight === 0 || msgInputHeight === 0) return

    if (prevHeight > msgInputHeight) {
      // input got smaller (message was sent/draft was deleted)
      // i.e., as the container height increases, the scroll position decreases
      container.current.scrollTop += prevHeight - msgInputHeight
    } else if (prevHeight < msgInputHeight) {
      // input got bigger (message received line breaks)
      // i.e., as the container height decreases, the scroll position increases
      container.current.scrollTop -= msgInputHeight - prevHeight
    }
  }, [msgInputHeight, previousHeight])

  const [text, setText] = useState('')
  const [parentMessage, setParentMessage] = useState<Message | null>(null)
  const onSend = useEvent(async () => {
    if (!text) return

    await sendMessage(text, parentMessage)
    setText('')
    setParentMessage(null)

    if (container.current) container.current.scrollTop = 1

    chatInput.current?.focus()
  })

  return (
    <div className="px-6 pb-4 h-full w-full relative">
      <div
        ref={container}
        className="w-full max-h-full flex flex-col-reverse flex-grow overflow-y-auto px-4 bg-white pb-4 relative"
        style={{ height: `calc(100% - (${msgInputHeight}px + 24px))` }}
        onScroll={onScroll}
      >
        {fetching ||
          (error && (
            <div className="text-center absolute inset-x-0 top-1/2 -translate-y-1/2">
              {fetching ? (
                <Loader className="mx-auto" />
              ) : (
                <div className="w-full text-center text-red-700">Something went wrong.</div>
              )}
            </div>
          ))}

        {messages.map((message, index) => (
          <Fragment key={message.id}>
            <ChatBubble
              message={message}
              onReplyTo={() => {
                setParentMessage(message)
                chatInput.current?.focus()
              }}
              highlighted={highlightedMessageId === message.id}
              onParentMessageClick={() => onParentMessageClick(message.parent?.id)}
            />
            {index === messages.length - 1 || getDayDifference(messages[index + 1].createdAt, message.createdAt) > 0 ? (
              <DateIndicator date={message.createdAt} />
            ) : null}
          </Fragment>
        ))}
      </div>

      <div className="absolute flex inset-x-0 bottom-0 bg-gray-100 border-t border-gray-100 p-2">
        <MessageInput
          ref={chatInput}
          replyTo={parentMessage}
          onRemoveReply={() => {
            setParentMessage(null)
            chatInput.current?.focus()
          }}
          className="flex-grow"
          value={text}
          onChange={({ target }) => setText(target.value)}
          disabled={sending}
          onSend={onSend}
        />
        <div className="self-end ml-2 flex-shrink-0 py-0.5">
          <CircularButton size="sm" icon={PaperAirplaneIcon} disabled={sending} onClick={onSend}>
            <span className="sr-only">Send</span>
          </CircularButton>
        </div>
      </div>
    </div>
  )
}
