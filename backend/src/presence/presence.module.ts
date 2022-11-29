import { Module } from '@nestjs/common'
import { PresenceGateway } from './gateway'
import { OrmModule } from '~/orm/orm.module'

@Module({
  imports: [OrmModule],
  providers: [PresenceGateway],
})
export class PresenceModule {}
