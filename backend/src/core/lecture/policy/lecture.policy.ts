import { Lecture } from '../model'
import { BasePolicy, Policy } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class LecturePolicy extends BasePolicy(User, Lecture) {
  create(user: User, _resource: Lecture) {
    return user.isInstructor
  }

  update(user: User, _resource: Lecture) {
    return user.isInstructor
  }

  findOne(_user: User, _resource: Lecture) {
    return true
  }

  findAll(_user: User) {
    return true
  }

  delete(user: User, resource: Lecture) {
    return user.isInstructor && user.id === resource.owner.id
  }
}
