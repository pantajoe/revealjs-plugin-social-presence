import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'
import { GroupCreateInput, GroupUpdateInput } from '../type'
import { GroupLoader, UserIdsByGroupLoader } from '../loader'
import { GROUP_WAS_UPDATED } from '../subscription-events'
import { Group } from '~/chat/model'
import { GroupPolicy } from '~/chat/policy'
import { GroupService } from '~/chat/service'
import { Action, CurrentUser, UsePolicy } from '~/core/auth'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { User } from '~/core/user/model'
import { CurrentLecture } from '~/core/lecture'
import { DataLoader, Loader, getDataLoader } from '~/core/graphql/dataloader'
import { Lecture } from '~/core/lecture/model'
import { UserLoader } from '~/core/user/graphql/loader'

@Resolver(() => Group)
@UsePolicy(GroupPolicy)
export class GroupResolver {
  constructor(@InjectPubSub() private readonly pubSub: PubSub, private readonly groupService: GroupService) {}

  @Query(() => Group)
  @Action('findAll')
  group(@CurrentLecture() lecture: Lecture, @CurrentUser() user: User) {
    return this.groupService.findOne({ lecture, user })
  }

  @Mutation(() => Group)
  @Action('create')
  createGroup(
    @CurrentLecture() lecture: Lecture,
    @CurrentUser() user: User,
    @Args('input', { type: () => GroupCreateInput }) input: GroupCreateInput,
  ) {
    return this.groupService.create(input, { user, lecture })
  }

  @Mutation(() => Group)
  @Action('update')
  updateGroup(
    @CurrentUser() user: User,
    @CurrentLecture() lecture: Lecture,
    @Args('id', { type: () => ID }) groupId: string,
    @Args('input', { type: () => GroupUpdateInput }) input: GroupUpdateInput,
  ) {
    return this.groupService.update(groupId, input, { user, lecture })
  }

  @Subscription(() => Group, {
    filter: ({ groupWasUpdated: payload }, variables, context) => {
      return (
        payload.groupId === variables.id &&
        payload.lectureId === context.req.lecture.id &&
        payload.userId !== context.req.user.id
      )
    },
    resolve: async ({ groupWasUpdated: payload }, args, context) => {
      const loader = await getDataLoader(context, GroupLoader)
      return loader.load(payload.groupId)
    },
  })
  @Action('findOne')
  groupWasUpdated(@Args('id', { type: () => ID }) _groupId: string) {
    return this.pubSub.asyncIterator(GROUP_WAS_UPDATED)
  }

  @ResolveField(() => [User])
  async members(
    @Parent() group: Group,
    @Loader(UserIdsByGroupLoader) userIdsLoader: DataLoader<string, string[]>,
    @Loader(UserLoader) userLoader: DataLoader<string, User>,
  ) {
    const userIds = await userIdsLoader.load(group.id)
    return userLoader.loadMany(userIds)
  }
}
