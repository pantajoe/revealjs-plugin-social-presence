import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { CurrentLecture, NoLecture } from '../../decorator'
import { Lecture } from '../../model'
import { ParticipantService } from '../../service'
import { PARTICIPANT_JOINED, PARTICIPANT_LEFT } from '../subscription-events'
import { ParticipantPolicy, ParticipationPolicy } from '../../policy'
import { Action, CurrentUser, Resource, UsePolicy } from '~/core/auth'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { getDataLoader } from '~/core/graphql/dataloader'
import { SuccessType } from '~/core/graphql/type'
import { UserLoader } from '~/core/user/graphql/loader'
import { User } from '~/core/user/model'

@Resolver()
@UsePolicy(ParticipantPolicy)
export class ParticipantResolver {
  constructor(
    private readonly participantService: ParticipantService,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  @Query(() => [User])
  @Action('findAll')
  @Resource(({ ctx }) => ctx.lecture)
  participants(@CurrentLecture() lecture: Lecture) {
    return lecture.participants.init()
  }

  @Mutation(() => Lecture)
  @NoLecture()
  @UsePolicy(ParticipationPolicy)
  @Action('create')
  joinLecture(
    @CurrentUser() user: User,
    @Args('lectureId', { type: () => ID }) lectureId: string,
    @Args('url', { type: () => String }) url: string,
  ) {
    return this.participantService.joinLecture({ lectureId, url }, user)
  }

  @Mutation(() => SuccessType)
  @UsePolicy(ParticipationPolicy)
  @Action('delete')
  @Resource(({ ctx }) => ctx.lecture)
  async leaveLecture(@CurrentUser() user: User, @CurrentLecture() lecture: Lecture) {
    await this.participantService.leaveLecture(lecture.id, user)
    return { success: true }
  }

  @Mutation(() => SuccessType)
  @UsePolicy(ParticipantPolicy)
  @Action('delete')
  async kickParticipant(
    @CurrentUser() user: User,
    @CurrentLecture() lecture: Lecture,
    @Args('id', { type: () => ID }) userId: string,
  ) {
    await this.participantService.kickParticipant(lecture.id, userId, { user })
    return { success: true }
  }

  @Subscription(() => User, {
    filter: ({ participantJoined: payload }, variables, context) =>
      payload.lectureId === context.req.lecture.id && payload.userId !== context.req.user.id,
    resolve: async ({ participantJoined: payload }, variables, context) => {
      const loader = await getDataLoader(context, UserLoader)
      return loader.load(payload.participantId)
    },
  })
  @Action('findAll')
  participantJoined() {
    return this.pubSub.asyncIterator(PARTICIPANT_JOINED)
  }

  @Subscription(() => User, {
    filter: ({ participantLeft: payload }, variables, context) =>
      payload.lectureId === context.req.lecture.id && payload.userId !== context.req.user.id,
    resolve: async ({ participantLeft: payload }, variables, context) => {
      const loader = await getDataLoader(context, UserLoader)
      return loader.load(payload.participantId)
    },
  })
  @Action('findAll')
  participantLeft() {
    return this.pubSub.asyncIterator(PARTICIPANT_LEFT)
  }
}
