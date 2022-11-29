import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IdentifierType {
  @Field(() => ID)
  id: string
}
