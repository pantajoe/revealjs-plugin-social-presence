import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Min, Validate, ValidateIf } from 'class-validator'
import * as Relay from 'graphql-relay'
import { CannotUseWith, CannotUseWithout } from '~/core/validator'

@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field(() => String, { nullable: true, description: 'Paginate before opaque cursor' })
  @ValidateIf((o) => o.before !== undefined)
  @Validate(CannotUseWithout, ['last'])
  @Validate(CannotUseWith, ['after', 'first'])
  before?: Relay.ConnectionCursor

  @Field(() => String, { nullable: true, description: 'Paginate after opaque cursor' })
  @ValidateIf((o) => o.after !== undefined)
  @Validate(CannotUseWithout, ['first'])
  @Validate(CannotUseWith, ['before', 'last'])
  after?: Relay.ConnectionCursor

  @Field(() => Int, { nullable: true, description: 'Paginate first' })
  @ValidateIf((o) => o.first !== undefined)
  @Min(1)
  @Validate(CannotUseWith, ['before', 'last'])
  first?: number

  @Field(() => Int, { nullable: true, description: 'Paginate last' })
  @ValidateIf((o) => o.last !== undefined)
  @Validate(CannotUseWithout, ['before'])
  @Validate(CannotUseWith, ['after', 'first'])
  @Min(1)
  last?: number
}
