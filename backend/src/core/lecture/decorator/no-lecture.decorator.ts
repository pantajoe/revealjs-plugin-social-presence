import { SetMetadata } from '@nestjs/common'

export const NO_LECTURE_KEY = 'no_lecture'

export function NoLecture() {
  return SetMetadata(NO_LECTURE_KEY, true)
}
