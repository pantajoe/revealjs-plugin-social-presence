import { MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { getRedisClientOptions } from '~/core/util'

@Injectable()
export class HealthService {
  constructor(private readonly orm: MikroORM) {}

  async checkApplicationStatus() {
    const results = await Promise.all([this.checkDatabaseConnection(), this.checkRedisConnection()])
    return results.every(Boolean)
  }

  private async checkDatabaseConnection() {
    const isConnected = await this.orm.isConnected()
    return isConnected
  }

  private async checkRedisConnection() {
    const redisClient = new Redis({
      ...getRedisClientOptions(),
      connectTimeout: 5_000,
      maxRetriesPerRequest: 5,
      lazyConnect: true,
    })

    try {
      await redisClient.connect()
      redisClient.disconnect()
      return true
    } catch (error) {
      return false
    }
  }
}
