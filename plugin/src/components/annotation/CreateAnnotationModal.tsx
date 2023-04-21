import { useForm } from 'react-hook-form'
import type { KeyboardEventHandler } from 'react'
import { useRef } from 'react'
import Button from '../generic/Button'
import type { ModalProps } from '../generic/Modal'
import Modal from '../generic/Modal'
import Textarea from '../generic/Textarea'
import { useEvent } from '~/hooks/react'
import { useAnnotations } from '~/hooks/use-annotations'
import { describe } from '~/lib/annotation/html'
import { handleFormError } from '~/utils'

export type CreateAnnotationModalProps = Pick<ModalProps, 'open' | 'onClose'> & {
  range: Range | null
}

export default function CreateAnnotationModal({ range, ...props }: CreateAnnotationModalProps) {
  const text = range?.toString() || ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      comment: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
  })

  const [, { addAnnotation }] = useAnnotations()
  const onSubmit = useEvent(async (values: { comment: string }) => {
    const target = describe(document.body, range!)
    await addAnnotation({ text: values.comment, quote: text, target })
    props.onClose(false)
    reset({ comment: '' })
  })

  const form = useRef<HTMLFormElement | null>(null)
  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useEvent((event) => {
    if (event.key === 'Enter') {
      event.stopPropagation()
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault()
        form.current!.submit()
      }
    }
  })

  const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = useEvent((event) => {
    if (event.key === '?') {
      event.stopPropagation()
    }
  })

  if (!range) return null

  return (
    <Modal {...props} size="md" stretch>
      <Modal.Title as="h3" className="font-bold text-gray-900 text-lg">
        Add Annotation
      </Modal.Title>

      <Modal.Content>
        <blockquote className="mb-6 p-2 pr-4 border-l-4 border-solid border-primary-500 bg-primary-300 bg-opacity-50 rounded">
          <p className="text-gray-700 italic">"{text}"</p>
        </blockquote>

        <form ref={form} onSubmit={handleFormError(handleSubmit(onSubmit))} className="space-y-4">
          <Textarea
            label="Your comment"
            rows={5}
            className="resize-none"
            {...register('comment', { required: true })}
            error={errors.comment?.message}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPress}
          />

          <Button type="submit" loading={isSubmitting} className="w-full">
            Annotate
          </Button>
        </form>
      </Modal.Content>
    </Modal>
  )
}
