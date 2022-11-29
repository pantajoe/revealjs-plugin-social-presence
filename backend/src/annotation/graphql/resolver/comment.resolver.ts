import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'
import { CommentLoader } from '../loader'
import { COMMENT_WAS_ADDED } from '../subscription-events'
import { CommentCreateInput } from '../type'
import { Comment } from '~/annotation/model'
import { CommentPolicy } from '~/annotation/policy.ts'
import { CommentService } from '~/annotation/service'
import { Action, CurrentUser, UsePolicy } from '~/core/auth'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { DataLoader, Loader, getDataLoader } from '~/core/graphql/dataloader'
import { CurrentLecture } from '~/core/lecture'
import { Lecture } from '~/core/lecture/model'
import { UserLoader } from '~/core/user/graphql/loader'
import { User } from '~/core/user/model'

@Resolver(() => Comment)
@UsePolicy(CommentPolicy)
export class CommentResolver {
  constructor(private readonly commentService: CommentService, @InjectPubSub() private readonly pubSub: PubSub) {}

  @Query(() => [Comment])
  @Action('findAll')
  comments(@Args('annotationId', { type: () => ID }) annotationId: string) {
    return this.commentService.findAll(annotationId)
  }

  @Mutation(() => Comment)
  @Action('create')
  createComment(
    @CurrentLecture() lecture: Lecture,
    @CurrentUser() user: User,
    @Args('input', { type: () => CommentCreateInput }) input: CommentCreateInput,
  ) {
    return this.commentService.create(input, { user, lecture })
  }

  @Subscription(() => Comment, {
    filter: ({ commentWasAdded: payload }, variables, context) => {
      return (
        payload.lectureId === context.req.lecture.id &&
        payload.userId !== context.req.user.id &&
        (typeof variables.annotationId === 'undefined' || payload.annotationId === variables.annotationId)
      )
    },
    resolve: async ({ commentWasAdded: payload }, variables, context) => {
      const loader = await getDataLoader(context, CommentLoader)
      return loader.load(payload.commentId)
    },
  })
  @Action('findAll')
  commentWasAdded(@Args('annotationId', { type: () => ID, nullable: true }) _annotationId: string | undefined) {
    return this.pubSub.asyncIterator(COMMENT_WAS_ADDED)
  }

  @ResolveField(() => User, { nullable: true })
  author(@Parent() comment: Comment, @Loader(UserLoader) userLoader: DataLoader<string, User>) {
    return comment.author ? userLoader.load(comment.author.id) : null
  }

  @ResolveField(() => ID)
  annotationId(@Parent() comment: Comment) {
    return comment.annotation.id
  }
}
