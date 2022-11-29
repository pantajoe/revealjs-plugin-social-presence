import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Group } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class GroupLoader extends BaseDataLoader<string, Group> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  query(keys: string[]): Promise<Group[]> {
    return this.orm.em.getRepository(Group).find({ id: keys }, { filters: false })
  }

  protected getOptions(): BaseDataLoaderOptions<string, Group> {
    return {
      query: this.query.bind(this),
    }
  }
}
