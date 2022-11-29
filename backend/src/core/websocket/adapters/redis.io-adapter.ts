import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { Redis } from 'ioredis'
import { createRedisClient } from '~/core/util'

export class RedisIoAdapter extends IoAdapter {
  private pubClient: Redis
  private subClient: Redis
  private adapterConstructor: ReturnType<typeof createAdapter>

  async connectToRedis(): Promise<void> {
    this.pubClient = createRedisClient({ lazyConnect: true })
    this.subClient = this.pubClient.duplicate()

    await Promise.all([this.pubClient.connect(), this.subClient.connect()])

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient)
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    return server
  }

  async dispose(): Promise<void> {
    this.pubClient.disconnect()
    this.subClient.disconnect()
  }
}
