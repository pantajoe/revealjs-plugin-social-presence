import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { GROUP_MEMBER_JOINED, GROUP_MEMBER_LEFT } from '../subscription-events'
import { Group } from '~/chat/model'
import { GroupMembershipPolicy } from '~/chat/policy'
import { GroupMembershipService } from '~/chat/service'
import { Action, CurrentUser, Resource, UsePolicy } from '~/core/auth'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { getDataLoader } from '~/core/graphql/dataloader'
import { UserLoader } from '~/core/user/graphql/loader'
import { User } from '~/core/user/model'

@Resolver()
@UsePolicy(GroupMembershipPolicy)
export class GroupMembershipResolver {
  constructor(
    private readonly memberService: GroupMembershipService,
    @InjectPubSub() private readonly pubSub: PubSub,
  ) {}

  @Query(() => [User])
  @Action('findAll')
  groupMembers(@Args('id', { type: () => ID }) groupId: string) {
    return this.memberService.findAll(groupId)
  }

  @Mutation(() => Group)
  @Action('create')
  @Resource('token')
  joinGroup(@CurrentUser() user: User, @Args('token', { type: () => String }) token: string) {
    return this.memberService.create(token, { user })
  }

  @Mutation(() => Group)
  @Action('delete')
  leaveGroup(@CurrentUser() user: User, @Args('id', { type: () => ID }) groupId: string) {
    return this.memberService.delete(groupId, { user })
  }

  @Subscription(() => User, {
    filter: ({ groupMemberJoined: payload }, variables, context) => {
      return (
        payload.groupId === variables.id &&
        payload.lectureId === context.req.lecture.id &&
        payload.userId !== context.req.user.id
      )
    },
    resolve: async ({ groupMemberJoined: payload }, variables, context) => {
      const loader = await getDataLoader(context, UserLoader)
      return loader.load(payload.userId)
    },
  })
  @Action('findOne')
  groupMemberJoined(@Args('id', { type: () => ID }) _groupId: string) {
    return this.pubSub.asyncIterator(GROUP_MEMBER_JOINED)
  }

  @Subscription(() => User, {
    filter: ({ groupMemberLeft: payload }, variables, context) => {
      return (
        payload.groupId === variables.id &&
        payload.lectureId === context.req.lecture.id &&
        payload.userId !== context.req.user.id
      )
    },
    resolve: async ({ groupMemberLeft: payload }, variables, context) => {
      const loader = await getDataLoader(context, UserLoader)
      return loader.load(payload.userId)
    },
  })
  @Action('findOne')
  groupMemberLeft(@Args('id', { type: () => ID }) _groupId: string) {
    return this.pubSub.asyncIterator(GROUP_MEMBER_LEFT)
  }
}
