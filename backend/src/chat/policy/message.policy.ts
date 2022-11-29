import { Message } from '../model'
import { BasePolicy, Policy, PolicyContext } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class MessagePolicy extends BasePolicy(User, Message) {
  findAll(user: User, ctx: PolicyContext) {
    if (!ctx.params.group) return true
    return this.isMember(user, ctx.params.group as string)
  }

  create(user: User, resource: Message | null, ctx: PolicyContext) {
    if (!ctx.params.group) return true
    return this.isMember(user, ctx.params.group as string)
  }

  private async isMember(user: User, groupId: string) {
    const [group] = await user.groups.init({ where: { id: groupId } })
    return Boolean(group)
  }
}
