import type { ChangeEvent, ComponentProps } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import Label from './Label'

export interface ImageInputProps extends Omit<ComponentProps<'input'>, 'placeholder'> {
  label?: string
  placeholder?: string | JSX.Element
  text?: string
  previewUrl?: string | undefined
  imageSize?: 'xs' | 'sm' | 'md' | 'lg'
  rounded?: boolean
  /** max byte size in human readable format */
  maxSize?: string
  error?: string
  hasCropping?: boolean
}

const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(function ImageInput(
  {
    id,
    label,
    maxSize,
    disabled = false,
    previewUrl,
    placeholder,
    imageSize = 'md',
    rounded,
    error,
    onChange,
    ...props
  },
  ref,
) {
  const innerRef = useRef<HTMLInputElement | null | undefined>(null)

  const [imageUrl, setImageUrl] = useState(previewUrl || '')
  useEffect(() => {
    setImageUrl(previewUrl || '')
  }, [previewUrl])
  const [file, setFile] = useState<File>()

  useEffect(() => {
    if (file) setImageUrl(URL.createObjectURL(file))

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0]
    setFile(newFile)

    onChange?.(event)
  }

  return (
    <div>
      {Boolean(label) && (
        <div className={clsx('flex', label ? 'justify-between' : 'justify-end')}>
          {label && (
            <Label htmlFor="about" className="!mb-2">
              {label}
            </Label>
          )}
        </div>
      )}
      <div
        id={id}
        className={clsx(
          'overflow-hidden ring-offset-0',
          {
            'w-12 h-12 rounded-md': imageSize === 'xs',
            'w-16 h-16 rounded-lg': imageSize === 'sm',
            'w-24 h-24 rounded-xl': imageSize === 'md',
            'w-36 h-36 rounded-xl': imageSize === 'lg',
          },
          rounded ? '!rounded-full' : '',
          error ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-200',
        )}
      >
        <input
          accept="image/jpeg, image/png"
          type="file"
          className="hidden"
          disabled={disabled}
          onChange={handleChange}
          {...props}
          ref={(node) => {
            innerRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
        />
        <div
          onClick={() => {
            innerRef.current?.click()
          }}
          className="relative overflow-hidden flex justify-center items-center w-full h-full"
        >
          <div
            className={clsx(
              'absolute opacity-0 duration-300 h-full w-full flex justify-center items-center text-sm bg-gray-200 text-black font-semibold cursor-default',
              !disabled && 'hover:opacity-60 hover:cursor-pointer',
            )}
          >
            edit
          </div>

          {imageUrl || previewUrl ? (
            <img className="min-w-full min-h-full object-cover" src={imageUrl || previewUrl} alt="..." />
          ) : typeof placeholder === 'string' ? (
            <img className="min-w-full min-h-full object-cover" src={placeholder} alt="..." />
          ) : (
            placeholder
          )}
        </div>
      </div>
      {Boolean(maxSize) && <p className="mt-1 text-sm text-gray-500 whitespace-pre-line">Max. size is {maxSize}</p>}
      {Boolean(error) && <p className="mt-1 mb-1 text-sm text-red-600">{error}</p>}
    </div>
  )
})

export default ImageInput
