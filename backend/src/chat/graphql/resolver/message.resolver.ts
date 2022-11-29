import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql'
import { MessageLoader } from '../loader'
import { MESSAGE_WAS_SENT } from '../subscription-events'
import { MessageConnection, MessageConnectionArgs, MessageCreateInput } from '../type'
import { Message } from '~/chat/model'
import { MessagePolicy } from '~/chat/policy'
import { MessageService } from '~/chat/service'
import { Action, CurrentUser, UsePolicy } from '~/core/auth'
import { InjectPubSub, PubSub } from '~/core/graphql'
import { DataLoader, Loader, getDataLoader } from '~/core/graphql/dataloader'
import { CurrentLecture } from '~/core/lecture'
import { Lecture } from '~/core/lecture/model'
import { User } from '~/core/user/model'
import { UserLoader } from '~/core/user/graphql/loader'

@Resolver(() => Message)
@UsePolicy(MessagePolicy)
export class MessageResolver {
  constructor(private readonly messageService: MessageService, @InjectPubSub() private readonly pubSub: PubSub) {}

  @Query(() => MessageConnection)
  @Action('findAll')
  messages(
    @CurrentLecture() lecture: Lecture,
    @CurrentUser() user: User,
    @Args({ type: () => MessageConnectionArgs }) args: MessageConnectionArgs,
  ) {
    return this.messageService.findAll(args, { lecture, user })
  }

  @Mutation(() => Message)
  @Action('create')
  sendMessage(
    @CurrentUser() user: User,
    @CurrentLecture() lecture: Lecture,
    @Args('input', { type: () => MessageCreateInput }) input: MessageCreateInput,
  ) {
    return this.messageService.create(input, { user, lecture })
  }

  @Subscription(() => Message, {
    filter: ({ messageWasSent: payload }, variables, context) => {
      return (
        payload.lectureId === context.req.lecture.id &&
        payload.userId !== context.req.user.id &&
        payload.groupId === variables.groupId
      )
    },
    resolve: async ({ messageWasSent: payload }, variables, context) => {
      const loader = await getDataLoader(context, MessageLoader)
      return loader.load(payload.messageId)
    },
  })
  @Action('findAll')
  messageWasSent(@Args('groupId', { type: () => ID, nullable: true }) _groupId: string | undefined) {
    return this.pubSub.asyncIterator(MESSAGE_WAS_SENT)
  }

  @ResolveField(() => User, { nullable: true })
  author(@Parent() message: Message, @Loader(UserLoader) userLoader: DataLoader<string, User>) {
    return message.author ? userLoader.load(message.author.id) : null
  }

  @ResolveField(() => Message, { nullable: true })
  parent(@Parent() message: Message, @Loader(MessageLoader) messageLoader: DataLoader<string, Message>) {
    return message.parent ? messageLoader.load(message.parent.id) : null
  }

  @ResolveField(() => ID, { nullable: true })
  groupId(@Parent() message: Message) {
    return message.group?.id
  }
}
