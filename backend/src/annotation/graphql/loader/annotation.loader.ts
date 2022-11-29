import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Annotation } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class AnnotationLoader extends BaseDataLoader<string, Annotation> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  query(keys: string[]): Promise<Annotation[]> {
    return this.orm.em.getRepository(Annotation).find({ id: keys }, { filters: false })
  }

  protected getOptions(): BaseDataLoaderOptions<string, Annotation> {
    return {
      query: this.query.bind(this),
    }
  }
}
