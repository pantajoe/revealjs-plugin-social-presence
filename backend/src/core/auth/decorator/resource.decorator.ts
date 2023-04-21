import { SetMetadata } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/core'
import { ParamsDictionary } from 'express-serve-static-core'
import { PolicyContext } from '../policy'
import { User } from '~/core/user/model'
import { BaseEntity } from '~/orm'

export type ResourceResolver = (xxx: {
  em: MikroORM['em']
  params: ParamsDictionary
  ctx: PolicyContext
  user: User
}) => any | BaseEntity<any | null> | Promise<any | BaseEntity<any> | null>

export type ResourceOptions = string | string[] | ResourceResolver

export const USE_RESOURCE_OPTIONS_KEY = 'use_resoure_options'

export function Resource(options: ResourceOptions) {
  return SetMetadata(USE_RESOURCE_OPTIONS_KEY, options)
}
