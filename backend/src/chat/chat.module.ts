import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { GroupByUserAndLectureLoader, GroupLoader, MessageLoader, UserIdsByGroupLoader } from './graphql/loader'
import { GroupMembershipResolver, GroupResolver, MessageResolver } from './graphql/resolver'
import { Group, Message } from './model'
import { GroupMembershipPolicy, GroupPolicy, MessagePolicy } from './policy'
import { GroupMembershipService, GroupService, MessageService } from './service'
import { User } from '~/core/user/model'

@Module({
  imports: [MikroOrmModule.forFeature([Message, Group, User])],
  providers: [
    MessageLoader,
    GroupLoader,
    UserIdsByGroupLoader,
    MessageService,
    GroupService,
    GroupMembershipService,
    MessageResolver,
    MessagePolicy,
    GroupPolicy,
    GroupMembershipPolicy,
    GroupByUserAndLectureLoader,
    GroupResolver,
    GroupMembershipResolver,
  ],
})
export class ChatModule {}
