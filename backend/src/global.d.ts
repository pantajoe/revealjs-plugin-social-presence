import { User as UserEntity } from './core/user/model/user.entity'
import { Lecture as LectureEntity } from './core/lecture/model/lecture.entity'

declare global {
  type Nullable<T> = null | T
  type Constructable<T = {}> = new (...input: any[]) => T
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
  type LooseAutocomplete<T extends string> = T | Omit<string, T>
  type AbstractInstanceType<T> = T extends { prototype: infer U } ? U : never
  type MaybeArray<T> = T | T[]
  type ExcludeKeys<T extends Record<string, U>, Excluded extends string> = T & { [key in Excluded]?: never }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserEntity
    lecture?: LectureEntity
  }
}

import { Socket as SocketType } from 'socket.io'
declare module 'socket.io' {
  export declare class WebSocket extends SocketType {
    handshake: SocketType['handshake'] & {
      user: UserEntity
      lecture: LectureEntity
    }
  }
}
