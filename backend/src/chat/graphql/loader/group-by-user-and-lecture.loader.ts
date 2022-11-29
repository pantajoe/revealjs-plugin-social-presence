import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { Group } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'
import { User } from '~/core/user/model'

type UserId = string
type LectureId = string

@Dataloader()
export class GroupByUserAndLectureLoader extends BaseDataLoader<[UserId, LectureId], Group> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  async query(keys: [UserId, LectureId][]): Promise<Group[]> {
    const groups = await (this.orm.em as EntityManager)
      .createQueryBuilder(Group, 'g')
      .select('*')
      .joinAndSelect('g.users', 'u')
      .where({ '("user_id","lecture_id")': { $in: keys } })

    return keys.map(
      ([userId, lectureId]) =>
        groups.find(
          (group) => group.users.contains(this.orm.em.getReference(User, userId)) && group.lecture.id === lectureId,
        )!,
    )
  }

  protected getOptions(): BaseDataLoaderOptions<[UserId, LectureId], Group> {
    return {
      query: this.query.bind(this),
    }
  }
}
