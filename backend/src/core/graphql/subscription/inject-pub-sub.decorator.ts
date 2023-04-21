import { Inject } from '@nestjs/common'
import { PUB_SUB_KEY } from './pub-sub.constant'

export function InjectPubSub() {
  return Inject(PUB_SUB_KEY)
}
