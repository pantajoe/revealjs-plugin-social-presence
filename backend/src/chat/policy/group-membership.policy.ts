import { Group } from '../model'
import { BasePolicy, Policy, PolicyContext } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class GroupMembershipPolicy extends BasePolicy(User, Group) {
  async findAll(user: User, ctx: PolicyContext): Promise<boolean> {
    const groupId = ctx.params.id as string | undefined
    if (!groupId) return false
    const [group] = await user.groups.init({ where: { lecture: ctx.lecture!.id, id: groupId } })
    return Boolean(group)
  }

  async findOne(user: User, resource: Group, ctx: PolicyContext): Promise<boolean> {
    const [group] = await user.groups.init({ where: { lecture: ctx.lecture!.id, id: resource.id } })
    return Boolean(group)
  }

  create(_user: User, _resource: Group | null, _ctx: PolicyContext) {
    return true
  }

  async delete(user: User, resource: Group, ctx: PolicyContext) {
    const [group] = await user.groups.init({ where: { lecture: ctx.lecture!.id, id: resource.id } })
    return Boolean(group)
  }
}
