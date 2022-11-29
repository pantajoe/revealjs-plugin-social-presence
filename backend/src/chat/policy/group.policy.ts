import { Group } from '../model'
import { BasePolicy, Policy, PolicyContext } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class GroupPolicy extends BasePolicy(User, Group) {
  findAll(_user: User, _ctx: PolicyContext): boolean | Promise<boolean> {
    return true
  }

  create(_user: User, _resource: Group | null, _ctx: PolicyContext) {
    return true
  }

  async findOne(user: User, resource: Group, ctx: PolicyContext) {
    const [group] = await user.groups.init({ where: { lecture: ctx.lecture!.id, id: resource.id } })
    return Boolean(group)
  }

  async update(user: User, resource: Group, ctx: PolicyContext) {
    const [group] = await user.groups.init({ where: { lecture: ctx.lecture!.id, id: resource.id } })
    return Boolean(group)
  }
}
