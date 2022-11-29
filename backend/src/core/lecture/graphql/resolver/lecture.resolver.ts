import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Lecture } from '../../model'
import { LecturePolicy } from '../../policy'
import { LectureCreateInput, LectureUpdateInput } from '../type'
import { LectureService } from '../../service'
import { CurrentLecture, NoLecture } from '../../decorator'
import { LectureLoader, ParticipantIdsByLectureLoader } from '../loader'
import { LECTURE_WAS_UPDATED } from '../subscription-events'
import { EntityRepository } from '~/orm'
import { Action, CurrentUser, Resource, UsePolicy } from '~/core/auth'
import { SuccessType } from '~/core/graphql/type'
import { User } from '~/core/user/model'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { DataLoader, Loader, getDataLoader } from '~/core/graphql/dataloader'
import { UserLoader } from '~/core/user/graphql/loader'
import { Group } from '~/chat/model'
import { GroupByUserAndLectureLoader } from '~/chat/graphql/loader'

@Resolver(() => Lecture)
@UsePolicy(LecturePolicy)
export class LectureResolver {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepository: EntityRepository<Lecture>,
    @InjectPubSub() private readonly pubSub: PubSub,
    private readonly lectureService: LectureService,
  ) {}

  @Query(() => Lecture)
  @Action('findOne')
  @Resource(({ ctx }) => ctx.lecture)
  lecture(@CurrentLecture() lecture: Lecture) {
    return lecture
  }

  @NoLecture()
  @Mutation(() => Lecture)
  @Action('create')
  createLecture(@CurrentUser() user: User, @Args('input') input: LectureCreateInput) {
    return this.lectureService.create(input, { user })
  }

  @Mutation(() => Lecture)
  @Action('update')
  @Resource(({ ctx }) => ctx.lecture)
  updateLecture(
    @CurrentUser() user: User,
    @CurrentLecture() lecture: Lecture,
    @Args('input') input: LectureUpdateInput,
  ) {
    return this.lectureService.update(lecture.id, input, { user })
  }

  @Mutation(() => SuccessType)
  @Action('delete')
  @Resource(({ ctx }) => ctx.lecture)
  async deleteLecture(@CurrentUser() user: User, @CurrentLecture() lecture: Lecture) {
    await this.lectureService.delete(lecture.id, { user })
    return { success: true }
  }

  @Subscription(() => Lecture, {
    filter: ({ lectureWasUpdated: payload }, variables, context) => {
      return payload.userId !== context.req.user.id && payload.lectureId === context.req.lecture.id
    },
    resolve: async ({ lectureWasUpdated: payload }, args, context) => {
      const loader = await getDataLoader<string, Lecture>(context, LectureLoader)
      return loader.load(payload.lectureId)
    },
  })
  @Action('findAll')
  lectureWasUpdated(@Args('ids', { type: () => [ID], nullable: true }) _ids: string[] | undefined) {
    return this.pubSub.asyncIterator(LECTURE_WAS_UPDATED)
  }

  @ResolveField(() => User)
  async owner(@Parent() lecture: Lecture, @Loader(UserLoader) userLoader: DataLoader<string, User>) {
    return userLoader.load(lecture.owner.id)
  }

  @ResolveField(() => [User])
  async participants(
    @Parent() lecture: Lecture,
    @Loader(ParticipantIdsByLectureLoader) participantIdsLoader: DataLoader<string, string[]>,
    @Loader(UserLoader) userLoader: DataLoader<string, User>,
  ) {
    const participantIds = await participantIdsLoader.load(lecture.id)
    return userLoader.loadMany(participantIds)
  }

  @ResolveField(() => Group, { nullable: true })
  async group(
    @Parent() lecture: Lecture,
    @CurrentUser() user: User,
    @Loader(GroupByUserAndLectureLoader) groupLoader: DataLoader<[string, string], Group>,
  ) {
    return groupLoader.load([user.id, lecture.id])
  }
}
