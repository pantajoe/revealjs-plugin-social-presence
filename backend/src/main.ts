import { LogLevel, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { MikroORM } from '@mikro-orm/core'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './core/websocket/adapters'
import { ensureNoPendingMigrations } from './orm/util'
import { buildCorsOptions } from '~/core/util'

const logger = ((): LogLevel[] => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'staging':
      return ['error', 'warn', 'log']
    case 'development':
    default:
      return ['log', 'error', 'warn', 'debug', ...(process.env.VERBOSE_LOGGING ? ['verbose' as LogLevel] : [])]
  }
})()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger,
    cors: buildCorsOptions(),
  })

  app.use(cookieParser(process.env.SECRET_KEY_BASE))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableShutdownHooks()

  const redisIoAdapter = new RedisIoAdapter(app)
  await redisIoAdapter.connectToRedis()
  app.useWebSocketAdapter(redisIoAdapter)

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase()
  await ensureNoPendingMigrations(app.get(MikroORM))

  await app.listen(process.env.PORT || 5000)
}

bootstrap()
