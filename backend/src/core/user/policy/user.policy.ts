import { User } from '../model'
import { BasePolicy, Policy } from '~/core/auth'

@Policy()
export class UserPolicy extends BasePolicy(User, User) {
  create(_user: User, _resource: User) {
    return true
  }

  update(user: User, resource: User) {
    return user.id === resource.id
  }

  findOne(user: User, resource: User) {
    return user.id === resource.id
  }

  delete(user: User, resource: User) {
    return user.id === resource.id
  }
}
