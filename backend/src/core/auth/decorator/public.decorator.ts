import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'is_public'

export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true)
}
