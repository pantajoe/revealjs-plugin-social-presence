import { URL } from 'node:url'
import Redis, { RedisOptions } from 'ioredis'

export function getRedisClientOptions() {
  const redisUrl = process.env.REDIS_URL ? new URL(process.env.REDIS_URL) : undefined

  return redisUrl
    ? {
        host: redisUrl.hostname,
        port: Number(redisUrl.port),
        ...(redisUrl.password ? { password: redisUrl.password } : {}),
        ...(redisUrl.username ? { username: redisUrl.username } : {}),
        ...(process.env.REDIS_URL.startsWith('rediss://') ? { tls: { servername: redisUrl.hostname } } : {}),
      }
    : undefined
}

export function createRedisClient(
  overrides: Omit<RedisOptions, 'host' | 'port' | 'username' | 'password' | 'tls'> = {},
) {
  const options = getRedisClientOptions() ?? {}

  return new Redis({
    ...options,
    ...overrides,
  })
}
