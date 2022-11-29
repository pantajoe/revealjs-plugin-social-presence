import { CheckIcon } from '@heroicons/react/20/solid'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { ButtonProps } from '../generic/Button'
import Button from '../generic/Button'
import { useEvent } from '~/hooks/react'

export type CopyButtonProps = Pick<ButtonProps<'button'>, 'icon' | 'size' | 'color'> & {
  text: string
  children: ReactNode
}

export default function CopyButton({ text, children, icon: Icon, ...buttonProps }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const onClick = useEvent(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  })

  return (
    <Button {...buttonProps} onClick={onClick} icon={copied ? CheckIcon : Icon}>
      {copied ? 'Copied!' : children}
    </Button>
  )
}
