import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { User } from '~/core/user/model'

@ObjectType('Token')
export class TokenType {
  @Field(() => String)
  accessToken: string

  @Field(() => GraphQLISODateTime)
  accessTokenExpiresAt: Date

  @Field(() => User)
  user: User
}
