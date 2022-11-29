import { SetMetadata } from '@nestjs/common'

export const NO_LECTURE_KEY = 'no_lecture'

export const NoLecture = () => SetMetadata(NO_LECTURE_KEY, true)
