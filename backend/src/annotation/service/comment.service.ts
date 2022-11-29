import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Annotation, Comment } from '../model'
import { CommentCreateInput } from '../graphql/type'
import { COMMENT_WAS_ADDED } from '../graphql/subscription-events'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { EntityRepository } from '~/orm'
import { AppContext } from '~/core/types'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Annotation) private readonly annotationRepository: EntityRepository<Annotation>,
    @InjectRepository(Comment) private readonly commentRepository: EntityRepository<Comment>,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  findAll(annotationId: string) {
    return this.commentRepository.find({ annotation: annotationId }, { orderBy: { createdAt: 'asc' } })
  }

  async create(input: CommentCreateInput, ctx: AppContext) {
    const annotation = await this.annotationRepository.findOneOrFail({ id: input.annotation })
    const comment = this.commentRepository.create({
      ...input,
      annotation,
      author: ctx.user,
    })
    await this.commentRepository.flush()
    await this.pubSub.publish(COMMENT_WAS_ADDED, {
      commentWasAdded: {
        commentId: comment.id,
        annotationId: annotation.id,
        userId: ctx.user.id,
        lectureId: ctx.lecture.id,
      },
    })
    return comment
  }
}
