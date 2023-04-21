import { Provider } from '@nestjs/common'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { PUB_SUB_KEY } from './pub-sub.constant'
import { createRedisClient } from '~/core/util'

export function PubSubFactory(): Provider {
  return {
    provide: PUB_SUB_KEY,
    useFactory: () => {
      return new RedisPubSub({
        publisher: createRedisClient(),
        subscriber: createRedisClient(),
        messageEventName: 'message',
        pmessageEventName: 'pmessage',
      })
    },
  }
}
