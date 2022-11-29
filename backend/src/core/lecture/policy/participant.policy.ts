import { BasePolicy, Policy } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class ParticipantPolicy extends BasePolicy(User, User) {
  update(user: User, _resource: User) {
    return user.isInstructor
  }

  findAll(_user: User) {
    return true
  }

  delete(user: User, resource: User) {
    return user.isInstructor || user.id === resource.id
  }
}
