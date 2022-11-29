import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor, PageInfo as RelayPageInfo } from 'graphql-relay'

@ObjectType()
export class PageInfo implements RelayPageInfo {
  @Field(() => String, { nullable: true })
  startCursor: ConnectionCursor | null

  @Field(() => String, { nullable: true })
  endCursor: ConnectionCursor | null

  @Field(() => Boolean, { defaultValue: false })
  hasPreviousPage: boolean

  @Field(() => Boolean, { defaultValue: false })
  hasNextPage: boolean
}
