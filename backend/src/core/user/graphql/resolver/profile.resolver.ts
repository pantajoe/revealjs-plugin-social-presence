import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { ProfileInput, RegisterInput } from '../type'
import { UserLoader } from '../loader'
import { USER_WAS_REMOVED, USER_WAS_UPDATED } from '../subscription-events'
import { CurrentUser, Public } from '~/core/auth'
import { User } from '~/core/user/model'
import { ProfileService } from '~/core/user/service'
import { NoLecture } from '~/core/lecture'
import { getDataLoader } from '~/core/graphql/dataloader'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { IdentifierType, SuccessType } from '~/core/graphql/type'

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService, @InjectPubSub() private readonly pubSub: PubSub) {}

  @NoLecture()
  @Query(() => User, { nullable: false })
  me(@CurrentUser() user: User) {
    return user
  }

  @NoLecture()
  @Mutation(() => User, { nullable: false })
  updateProfile(@CurrentUser() user: User, @Args('input', { type: () => ProfileInput }) updateData: ProfileInput) {
    return this.profileService.update({ user, updateData })
  }

  @Public()
  @Mutation(() => User)
  register(@Args('input', { type: () => RegisterInput }) data: RegisterInput) {
    return this.profileService.register(data)
  }

  @NoLecture()
  @Mutation(() => SuccessType)
  async deleteProfile(@CurrentUser() user: User) {
    await this.profileService.delete(user)
    return { success: true }
  }

  @Subscription(() => User, {
    filter: ({ userWasUpdated: payload }, variables, context) =>
      payload.userId !== context.req.user.id && (payload.lectureIds as string[]).includes(context.req.lecture.id),
    resolve: async ({ userWasUpdated: payload }, variables, context) => {
      const loader = await getDataLoader(context, UserLoader)
      return loader.load(payload.userId)
    },
  })
  userWasUpdated() {
    return this.pubSub.asyncIterator(USER_WAS_UPDATED)
  }

  @Subscription(() => IdentifierType, {
    filter: ({ userWasRemoved: payload }, variables, context) =>
      payload.userId !== context.req.user.id && (payload.lectureIds as string[]).includes(context.req.lecture.id),
    resolve: ({ userWasRemoved: payload }) => {
      return { id: payload.userId }
    },
  })
  userWasRemoved() {
    return this.pubSub.asyncIterator(USER_WAS_REMOVED)
  }
}
