import { ObjectType } from '@nestjs/graphql'
import { Message } from '~/chat/model'
import { ConnectionType } from '~/core/graphql/connection'

@ObjectType()
export class MessageConnection extends ConnectionType('Message', () => Message) {}
