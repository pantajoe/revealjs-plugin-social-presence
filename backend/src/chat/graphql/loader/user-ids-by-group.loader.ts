import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Group } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class UserIdsByGroupLoader extends BaseDataLoader<string, string[]> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  async query(keys: string[]): Promise<string[][]> {
    const groups = await this.orm.em.getRepository(Group).find({ id: keys }, { populate: ['users'], filters: false })
    return keys.map((key) => groups.find((group) => group.id === key)!.users.getIdentifiers<string>())
  }

  protected getOptions(): BaseDataLoaderOptions<string, string[]> {
    return {
      query: this.query.bind(this),
    }
  }
}
