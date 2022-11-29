import { Field, InputType } from '@nestjs/graphql'

@InputType({ isAbstract: true })
export class LectureBaseInput {
  @Field(() => String)
  name: string
}
