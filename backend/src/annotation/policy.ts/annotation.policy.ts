import { Annotation } from '../model'
import { BasePolicy, Policy } from '~/core/auth'
import { User } from '~/core/user/model'

@Policy()
export class AnnotationPolicy extends BasePolicy(User, Annotation) {
  create() {
    return true
  }

  findOne() {
    return true
  }

  findAll(_user: User) {
    return true
  }

  async delete(user: User, resource: Annotation) {
    if (resource.author?.id !== user.id) return false
    const commentCount = await resource.comments.loadCount()
    return commentCount === 0
  }
}
