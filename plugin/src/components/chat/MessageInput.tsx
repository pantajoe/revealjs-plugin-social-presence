import { XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import type { ChangeEvent, ComponentProps, KeyboardEventHandler } from 'react'
import { forwardRef, useRef } from 'react'
import { truncate } from 'lodash'
import { useEvent } from '~/hooks/react'
import type { MessageFragment as Message } from '~/graphql'
import { useAutosizeTextArea } from '~/hooks/dom'

export interface MessageInputProps extends Omit<ComponentProps<'textarea'>, 'value' | 'onChange' | 'rows'> {
  replyTo?: Message | null | undefined
  value?: string | null | undefined
  onChange?: (value: ChangeEvent<HTMLTextAreaElement>) => void
  onRemoveReply?: (val: null) => any
  onSend?: () => any
}

export default forwardRef<HTMLTextAreaElement, MessageInputProps>(function MessageInput(
  {
    replyTo,
    value,
    onChange,
    onSend,
    onRemoveReply,
    className,
    id = 'message',
    placeholder = 'Type your message',
    disabled = false,
    name = 'message',
    ...props
  },
  ref,
) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  useAutosizeTextArea(internalRef, value || '')

  const htmlAttributes = {
    id,
    name,
    placeholder,
    disabled,
    ...props,
  }

  const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = useEvent((event) => {
    if (event.key === '?') {
      event.stopPropagation()
    }
  })

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useEvent((event) => {
    if (event.key === 'Enter') {
      event.stopPropagation()
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault()
        onSend?.()
      }
    }
  })

  const replyToMessage = replyTo ? truncate(replyTo.text, { length: 100 }) : undefined

  return (
    <div
      className={clsx(
        className,
        'relative min-w-0 bg-white border border-solid rounded-lg shadow-sm overflow-hidden focus-within:border-primary-500 border-gray-300',
      )}
    >
      {replyToMessage && (
        <div className="flex justify-between mb-2 m-1 rounded bg-primary-300 bg-opacity-50 border-l-4 border-solid border-primary-500 p-1">
          <p className="text-xs break-words text-gray-600">{replyToMessage}</p>
          <button
            type="button"
            className="mr-0.5 text-gray-500 hover:text-gray-700 duration-200 translation-colors ease-in-out"
            onClick={() => onRemoveReply?.(null)}
          >
            <span className="sr-only">Remove reply</span>
            <XMarkIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <label htmlFor="message" className="sr-only">
        Add your message
      </label>
      <textarea
        {...htmlAttributes}
        ref={(node) => {
          internalRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        value={value || ''}
        className="form-textarea overflow-y-auto block w-full py-2 border-0 resize-none focus:ring-0 text-sm"
        style={{ minHeight: '16px', maxHeight: '96px' }}
        onKeyDown={onKeyDown}
        onKeyPress={onKeyPress}
        onChange={onChange}
      />
    </div>
  )
})
