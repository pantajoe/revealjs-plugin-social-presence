import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Message } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class MessageLoader extends BaseDataLoader<string, Message> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  query(keys: string[]): Promise<Message[]> {
    return this.orm.em.getRepository(Message).find({ id: keys }, { filters: false })
  }

  protected getOptions(): BaseDataLoaderOptions<string, Message> {
    return {
      query: this.query.bind(this),
    }
  }
}
