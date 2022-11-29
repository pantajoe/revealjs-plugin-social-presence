import { ArgsType, Field } from '@nestjs/graphql'
import { ConnectionArgs } from './connection.args'

@ArgsType()
export class SearchConnectionArgs extends ConnectionArgs {
  @Field({ nullable: true, description: 'Search query', defaultValue: '' })
  search: string
}
