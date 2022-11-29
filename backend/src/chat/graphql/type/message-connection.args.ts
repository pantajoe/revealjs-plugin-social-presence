import { ArgsType, Field, ID } from '@nestjs/graphql'
import { ConnectionArgs } from '~/core/graphql'

@ArgsType()
export class MessageConnectionArgs extends ConnectionArgs {
  @Field(() => ID, { nullable: true })
  group?: string = ''
}
