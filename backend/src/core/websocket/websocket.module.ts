import { Global, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { LectureModule } from '../lecture/lecture.module'
import { WsAccessGuardService } from './service'

@Global()
@Module({
  imports: [AuthModule, LectureModule],
  providers: [WsAccessGuardService],
  exports: [WsAccessGuardService],
})
export class WebSocketModule {}
