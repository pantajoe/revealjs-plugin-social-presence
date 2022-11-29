import { Field, InputType } from '@nestjs/graphql'

@InputType({ isAbstract: true })
export class GroupBaseInput {
  @Field(() => String)
  name: string
}
