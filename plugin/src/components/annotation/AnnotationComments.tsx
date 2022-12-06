import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import MessageInput from '../chat/MessageInput'
import CircularButton from '../generic/CircularButton'
import CommentBox from './CommentBox'
import AnnotationTile from './AnnotationTile'
import type { SocialAnnotation } from '~/graphql'
import { useEvent } from '~/hooks/react'
import { useAnnotation } from '~/hooks/use-annotation'

export interface AnnotationCommentsProps {
  annotation: SocialAnnotation
  onRemove?: (arg: null) => any
}

export default function AnnotationComments({ annotation, onRemove }: AnnotationCommentsProps) {
  const { comments, addComment } = useAnnotation(annotation)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const onSend = useEvent(async () => {
    if (!text) return
    setSending(true)
    await addComment(text)
    setSending(false)
    setText('')
  })

  return (
    <>
      <AnnotationTile annotation={annotation} onRemove={() => onRemove?.(null)} replyCount={comments.length} />
      <div className="w-full border-t pt-2 border-solid border-gray-200">
        {comments.map((comment) => (
          <CommentBox key={comment.id} comment={comment} />
        ))}
        <div className="flex pt-2">
          <MessageInput
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
    </>
  )
}
