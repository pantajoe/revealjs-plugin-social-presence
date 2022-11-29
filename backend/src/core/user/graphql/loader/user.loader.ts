import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'
import { User } from '~/core/user/model'

@Dataloader()
export class UserLoader extends BaseDataLoader<string, User> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  query(keys: string[]): Promise<User[]> {
    return this.orm.em.getRepository(User).find({ id: keys }, { filters: false })
  }

  protected getOptions(): BaseDataLoaderOptions<string, User> {
    return {
      query: this.query.bind(this),
    }
  }
}
