import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Comment } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class CommentLoader extends BaseDataLoader<string, Comment> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  query(keys: string[]): Promise<Comment[]> {
    return this.orm.em.getRepository(Comment).find({ id: keys }, { filters: false })
  }

  protected getOptions(): BaseDataLoaderOptions<string, Comment> {
    return {
      query: this.query.bind(this),
    }
  }
}
