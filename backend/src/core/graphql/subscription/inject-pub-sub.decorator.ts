import { Inject } from '@nestjs/common'
import { PUB_SUB_KEY } from './pub-sub.constant'

export const InjectPubSub = () => Inject(PUB_SUB_KEY)
