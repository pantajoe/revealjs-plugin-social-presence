import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Annotation } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class CommentIdsByAnnotationLoader extends BaseDataLoader<string, string[]> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  async query(keys: string[]): Promise<string[][]> {
    const annotations = await this.orm.em
      .getRepository(Annotation)
      .find({ id: keys }, { populate: ['comments'], filters: false })
    return keys.map((key) => annotations.find((annotation) => annotation.id === key)!.comments.getIdentifiers<string>())
  }

  protected getOptions(): BaseDataLoaderOptions<string, string[]> {
    return {
      query: this.query.bind(this),
    }
  }
}
