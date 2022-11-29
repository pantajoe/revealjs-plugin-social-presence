import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ValidityType {
  @Field(() => Boolean)
  isValid: boolean
}
