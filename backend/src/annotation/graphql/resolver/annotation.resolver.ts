import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'
import { AnnotationLoader, CommentIdsByAnnotationLoader } from '../loader'
import { ANNOTATION_WAS_CREATED, ANNOTATION_WAS_REMOVED } from '../subscription-events'
import { AnnotationCreateInput } from '../type'
import { Annotation } from '~/annotation/model'
import { AnnotationPolicy } from '~/annotation/policy.ts'
import { AnnotationService } from '~/annotation/service'
import { Action, CurrentUser, UsePolicy } from '~/core/auth'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { DataLoader, Loader, getDataLoader } from '~/core/graphql/dataloader'
import { IdentifierType, SuccessType } from '~/core/graphql/type'
import { CurrentLecture } from '~/core/lecture'
import { Lecture } from '~/core/lecture/model'
import { User } from '~/core/user/model'
import { UserLoader } from '~/core/user/graphql/loader'

@Resolver(() => Annotation)
@UsePolicy(AnnotationPolicy)
export class AnnotationResolver {
  constructor(private readonly annotationService: AnnotationService, @InjectPubSub() private readonly pubSub: PubSub) {}

  @Query(() => [Annotation])
  @Action('findAll')
  annotations() {
    return this.annotationService.findAll()
  }

  @Mutation(() => Annotation)
  @Action('create')
  createAnnotation(
    @CurrentLecture() lecture: Lecture,
    @CurrentUser() user: User,
    @Args('input', { type: () => AnnotationCreateInput }) input: AnnotationCreateInput,
  ) {
    return this.annotationService.create(input, { user, lecture })
  }

  @Mutation(() => SuccessType)
  @Action('delete')
  async deleteAnnotation(
    @CurrentLecture() lecture: Lecture,
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    await this.annotationService.delete(id, { user, lecture })
    return { success: true }
  }

  @Subscription(() => Annotation, {
    filter: ({ annotationWasCreated: payload }, variables, context) => {
      return payload.lectureId === context.req.lecture.id && payload.userId !== context.req.user.id
    },
    resolve: async ({ annotationWasCreated: payload }, variables, context) => {
      const loader = await getDataLoader(context, AnnotationLoader)
      return loader.load(payload.annotationId)
    },
  })
  @Action('findAll')
  annotationWasCreated() {
    return this.pubSub.asyncIterator(ANNOTATION_WAS_CREATED)
  }

  @Subscription(() => IdentifierType, {
    filter: ({ annotationWasRemoved: payload }, variables, context) => {
      return payload.lectureId === context.req.lecture.id && payload.userId !== context.req.user.id
    },
    resolve: ({ annotationWasRemoved: payload }) => {
      return { id: payload.annotationId }
    },
  })
  @Action('findAll')
  annotationWasRemoved() {
    return this.pubSub.asyncIterator(ANNOTATION_WAS_REMOVED)
  }

  @ResolveField(() => User, { nullable: true })
  author(@Parent() annotation: Annotation, @Loader(UserLoader) userLoader: DataLoader<string, User>) {
    return annotation.author ? userLoader.load(annotation.author.id) : null
  }

  @ResolveField(() => Int)
  async commentsCount(
    @Parent() annotation: Annotation,
    @Loader(CommentIdsByAnnotationLoader) loader: DataLoader<string, string[]>,
  ) {
    return (await loader.load(annotation.id)).length
  }
}
