import { Lecture } from '../model'
import { BasePolicy, Policy, PolicyContext } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class ParticipationPolicy extends BasePolicy(User, Lecture) {
  create(_user: User, _resource: Lecture | null, _ctx: PolicyContext): boolean | Promise<boolean> {
    return true
  }

  delete(_user: User, _resource: Lecture, _ctx: PolicyContext): boolean | Promise<boolean> {
    return true
  }
}
