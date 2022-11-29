import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'
import { Lecture } from '~/core/lecture/model'

@Dataloader()
export class LectureLoader extends BaseDataLoader<string, Lecture> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  query(keys: string[]): Promise<Lecture[]> {
    return this.orm.em.getRepository(Lecture).find({ id: keys }, { filters: false })
  }

  protected getOptions(): BaseDataLoaderOptions<string, Lecture> {
    return {
      query: this.query.bind(this),
    }
  }
}
