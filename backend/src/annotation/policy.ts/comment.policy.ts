import { Comment } from '../model'
import { BasePolicy, Policy } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class CommentPolicy extends BasePolicy(User, Comment) {
  create() {
    return true
  }

  findAll() {
    return true
  }
}
