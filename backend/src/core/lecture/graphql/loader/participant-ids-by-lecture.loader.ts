import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Lecture } from '../../model'
import { BaseDataLoader, BaseDataLoaderOptions, Dataloader } from '~/core/graphql/dataloader'

@Dataloader()
export class ParticipantIdsByLectureLoader extends BaseDataLoader<string, string[]> {
  constructor(private readonly orm: MikroORM) {
    super()
  }

  @UseRequestContext()
  async query(keys: string[]): Promise<string[][]> {
    const lectures = await this.orm.em
      .getRepository(Lecture)
      .find({ id: keys }, { populate: ['participants'], filters: false })
    return keys.map((key) => lectures.find((lecture) => lecture.id === key)!.participants.getIdentifiers<string>())
  }

  protected getOptions(): BaseDataLoaderOptions<string, string[]> {
    return {
      query: this.query.bind(this),
    }
  }
}
