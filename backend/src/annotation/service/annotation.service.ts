import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Annotation } from '../model'
import { AnnotationCreateInput } from '../graphql/type'
import { ANNOTATION_WAS_CREATED, ANNOTATION_WAS_REMOVED } from '../graphql/subscription-events'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { EntityRepository } from '~/orm'
import { AppContext } from '~/core/types'

@Injectable()
export class AnnotationService {
  constructor(
    @InjectRepository(Annotation) private readonly annotationRepository: EntityRepository<Annotation>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  findAll() {
    return this.annotationRepository.findAll()
  }

  async create(input: AnnotationCreateInput, ctx: AppContext) {
    const annotation = this.annotationRepository.create({
      ...input,
      author: ctx.user,
      lecture: ctx.lecture,
    })
    await this.annotationRepository.flush()
    await this.pubSub.publish(ANNOTATION_WAS_CREATED, {
      annotationWasCreated: {
        annotationId: annotation.id,
        userId: ctx.user.id,
        lectureId: ctx.lecture.id,
      },
    })
    return annotation
  }

  async delete(id: string, ctx: AppContext) {
    const annotation = await this.annotationRepository.findOneOrFail({ id, lecture: ctx.lecture })
    this.annotationRepository.removeAndFlush(annotation)
    await this.pubSub.publish(ANNOTATION_WAS_REMOVED, {
      annotationWasRemoved: {
        annotationId: annotation.id,
        userId: ctx.user.id,
        lectureId: ctx.lecture.id,
      },
    })
  }
}
