import { SetMetadata } from '@nestjs/common'
import { ParamsDictionary } from 'express-serve-static-core'

export const ACTION_KEY = 'action'

export type TAction = 'findAll' | 'create' | 'findOne' | 'update' | 'delete'
export type ActionDecoratorParam = TAction | ((params: ParamsDictionary) => TAction)

export function Action(action: ActionDecoratorParam) {
  return SetMetadata(ACTION_KEY, action)
}
