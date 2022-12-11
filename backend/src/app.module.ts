import { join } from 'path'
import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { CoreModule } from './core/core.module'
import { StorageModule } from './storage/storage.module'
import { HealthModule } from './health/health.module'
import { PresenceModule } from './presence/presence.module'
import { ChatModule } from './chat/chat.module'
import { AnnotationModule } from './annotation/annotation.module'

@Module({
  imports: [
    CoreModule,
    HealthModule,
    StorageModule,
    PresenceModule,
    ChatModule,
    AnnotationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveStaticOptions: {
        cacheControl: true,
        immutable: true,
        maxAge: 31536000,
      },
    }),
  ],
})
export class AppModule {}
