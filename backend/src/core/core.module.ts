import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { GraphqlModule } from './graphql/graphql.module'
import { LectureModule } from './lecture/lecture.module'
import { WebSocketModule } from './websocket/websocket.module'
import { AdminModule } from './admin/admin.module'
import { OrmModule } from '~/orm/orm.module'

@Module({
  imports: [OrmModule, GraphqlModule, WebSocketModule, AuthModule, UserModule, LectureModule, AdminModule],
  controllers: [],
})
export class CoreModule {}
