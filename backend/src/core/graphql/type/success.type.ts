import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SuccessType {
  @Field(() => Boolean)
  success: boolean
}
