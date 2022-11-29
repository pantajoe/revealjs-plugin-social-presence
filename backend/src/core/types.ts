import { User } from './user/model'
import { Lecture } from './lecture/model'

export type AppContext<WithLecture extends boolean = true> = { user: User } & (WithLecture extends true
  ? { lecture: Lecture }
  : { lecture?: Lecture })
