import { Lecture } from '~/core/lecture/model'

export type TPolicy<U, R> = AbstractPolicy<U, R> & {
  userClass: Constructable<InstanceType<any>>
  resourceClass: AbstractInstanceType<any>
}

export interface PolicyClass<U, R> {
  new (...args: any[]): TPolicy<U, R>
}

export interface PolicyContext {
  lecture?: Lecture
  params: Record<string, unknown>
}

/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars */
class AbstractPolicy<User, Resource> {
  findAll(user: User, ctx: PolicyContext): boolean | Promise<boolean> {
    return false
  }

  create(user: User, resource: Resource | null, ctx: PolicyContext): boolean | Promise<boolean> {
    return false
  }

  findOne(user: User, resource: Resource, ctx: PolicyContext): boolean | Promise<boolean> {
    return false
  }

  update(user: User, resource: Resource, ctx: PolicyContext): boolean | Promise<boolean> {
    return false
  }

  delete(user: User, resource: Resource, ctx: PolicyContext): boolean | Promise<boolean> {
    return false
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars */

export function BasePolicy<TUser extends Constructable<any>, TResource extends AbstractInstanceType<any>>(
  User: TUser,
  Resource: TResource,
): PolicyClass<InstanceType<TUser>, AbstractInstanceType<TResource>> {
  return class extends AbstractPolicy<InstanceType<TUser>, AbstractInstanceType<TResource>> {
    get userClass() {
      return User
    }

    get resourceClass() {
      return Resource
    }
  }
}
