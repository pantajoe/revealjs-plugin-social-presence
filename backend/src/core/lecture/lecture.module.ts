import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module, forwardRef } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { TokenModule } from '../token/token.module'
import { AuthModule } from '../auth/auth.module'
import { LectureAccessGuard } from './guard'
import { Lecture } from './model'
import { LectureAccessService, LectureService, ParticipantService } from './service'
import { LectureResolver, ParticipantResolver } from './graphql/resolver'
import { LectureLoader, ParticipantIdsByLectureLoader } from './graphql/loader'
import { LecturePolicy, ParticipantPolicy, ParticipationPolicy } from './policy'
import { StorageModule } from '~/storage/storage.module'
import { User } from '~/core/user/model'
import { ChatModule } from '~/chat/chat.module'

@Module({
  imports: [
    MikroOrmModule.forFeature([Lecture, User]),
    UserModule,
    ChatModule,
    StorageModule,
    TokenModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    LectureAccessService,
    LectureService,
    ParticipantService,
    LectureAccessGuard,
    LectureResolver,
    ParticipantResolver,
    LectureLoader,
    ParticipantIdsByLectureLoader,
    LecturePolicy,
    ParticipantPolicy,
    ParticipationPolicy,
  ],
  exports: [LectureAccessService, LectureAccessGuard, LectureService],
})
export class LectureModule {}
