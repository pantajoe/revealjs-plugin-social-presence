import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { StorageModule } from './storage/storage.module'
import { HealthModule } from './health/health.module'
import { PresenceModule } from './presence/presence.module'
import { ChatModule } from './chat/chat.module'
import { AnnotationModule } from './annotation/annotation.module'

@Module({
  imports: [CoreModule, HealthModule, StorageModule, PresenceModule, ChatModule, AnnotationModule],
})
export class AppModule {}
